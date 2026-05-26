import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { type UserTokenPayload } from "@budget-now/contract";
import * as UserApi from "../Auth.api"

interface AuthContextType {
    user: UserTokenPayload | null;
    login: (userData: UserTokenPayload) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props{
    children: React.ReactNode
}

export function AuthProvider({ children }:Props){
    const [user, setUser] = useState<UserTokenPayload | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const data = await UserApi.me();
            
            if (data && data.user) {
                setUser(data.user as UserTokenPayload);
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
        setUser(userData);
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