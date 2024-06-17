import { useAuth } from "@/contexts/auth/authContext";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

export function DefaultLayout() {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="text-zinc-500 size-6 animate-spin" /> 
                    <p className="text-2xl">Carregando...</p>
                </div>
            </div>
        )
    }

    if (!token) {
        return (
            <Navigate to="/signin" />
        )
    }

    return (
        
        <Outlet />
    )
}