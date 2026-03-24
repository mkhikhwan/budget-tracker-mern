import { useEffect, useState, createContext, useContext, use } from "react";
import { type UserTokenPayload } from "@budget-now/contract";

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

    useEffect(()=>{
        const fetchUser = async () => {
            try{
                await new Promise((resolve) => setTimeout(resolve, 2000));

                const res = await fetch("http://localhost:5000/api/auth/me", {
                    credentials: "include"
                });
                if(!res.ok) throw new Error("Cannot authenticate.");

                const data: { 
                    user : UserTokenPayload 
                } = await res.json();

                setUser(data.user);
            }catch(e:unknown){
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    },[]);

    const login = (userData:UserTokenPayload) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
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