import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { type UserTokenPayload } from "@budget-now/contract";
import * as UserApi from "../Auth.api"

interface AuthUser extends UserTokenPayload {
    currency: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (userData: UserTokenPayload) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props{
    children: React.ReactNode
}

export function AuthProvider({ children }:Props){
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const getCountryCurrency = async (countryCode: string) => {
        try {
            const res = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}?fields=currencies`);
            if (!res.ok) throw new Error("Failed to fetch currency");
            const data = await res.json();
            const currencyCode = Object.keys(data.currencies)[0];
            return data.currencies[currencyCode];
        } catch (error) {
            console.error("Error fetching currency:", error);
            return null;
        }
    };

    const fetchUser = async () => {
        try {
            const data = await UserApi.me();
            
            if (data && data.user) {
                let currencySymbol = "$";

                if(data.user.country){
                    const currency = await getCountryCurrency(data.user.country!);
                    if(currency){
                        currencySymbol = currency.symbol || currency.name || "$";
                    }
                }

                setUser({
                    ...(data.user as UserTokenPayload),
                    currency: currencySymbol
                });
            } else {
                setUser(null);
            }
        }catch(e:unknown){
            setUser(null);
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = useCallback(async (userData: UserTokenPayload) => {
        let currencySymbol = "$";

        if (userData.country) {
            const currency = await getCountryCurrency(userData.country);
            if (currency) {
                currencySymbol = currency.symbol || currency.name || "$";
            }
        }

        const authUser: AuthUser = {
            ...userData,
            currency: currencySymbol
        };

        setUser(authUser);
    }, []);

    const logout = useCallback(async () => {
        try {
            await UserApi.logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};