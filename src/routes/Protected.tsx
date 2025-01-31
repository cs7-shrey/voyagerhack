import { useAuthStore } from "@/store/useAuthStore"
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";
// import { checkAuth } from "@/store/useAuthStore";
export function Protected() {
    const { authUserEmail, isCheckingAuth } = useAuthStore();
    const [canProcess, setCanProcess] = useState(false);
    useEffect(() => {
        setCanProcess(true);
    }, [])
    
    if (!authUserEmail && !isCheckingAuth && canProcess) {
        console.log('no auth user')
        return <Navigate to="/login" />
    }
    return <Outlet />
}