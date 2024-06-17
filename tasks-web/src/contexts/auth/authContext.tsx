/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/services/api";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    token: string | null;
    loading: boolean;
    setLoading: (value: React.SetStateAction<boolean>) => void;
    handleSetToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const currentToken = localStorage.getItem('token') || null;
    const [token, setToken] = useState<string | null>(currentToken);
    const [loading, setLoading] = useState(false);

    function handleSetToken(token: string) {
        setToken(token);
    }

    useEffect(() => {
        if (token) {
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete api.defaults.headers.common.Authorization;
            localStorage.removeItem('token');
        }
    }, [token])
    
    return (
        <AuthContext.Provider value={{ token, loading, setLoading, handleSetToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}