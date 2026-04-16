import { useEffect, useState, createContext, useContext } from "react";
import { type UserTokenPayload } from "@budget-now/contract";
import * as UserApi from "../Auth.api"

interface AuthUser extends UserTokenPayload {
    currency: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (userData: AuthUser) => void;
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


    useEffect(()=>{
        const fetchUser = async () => {
            try{
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const res = await fetch("http://localhost:5000/api/auth/me", {
                    credentials: "include"
                });
                if(!res.ok) throw new Error("Cannot authenticate.");

                const data: { 
                    user : UserTokenPayload 
                } = await res.json();

                const currency = await getCountryCurrency(data.user.country!);
                
                setUser({
                    ...data.user,
                    currency: currency ? currency.symbol : '$'
                });
            }catch(e:unknown){
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    },[]);

    const login = (userData: AuthUser) => {
        setUser(userData);
    }

    const logout = async () => {
        try {
            await UserApi.logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
        }
    }

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