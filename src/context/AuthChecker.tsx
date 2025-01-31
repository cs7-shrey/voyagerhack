import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'
import { checkAuth } from '@/store/useAuthStore'

const AuthChecker = () => {
    const { isCheckingAuth, setIsCheckingAuth } = useAuthStore();
    const [canProcess, setCanProcess] = useState(false);
    useEffect(() => {
        setIsCheckingAuth(true)
        checkAuth()
        setCanProcess(true);
    }, [setIsCheckingAuth])
    if (!canProcess || isCheckingAuth) {
        return (<div>Loading...</div>)
    }
    return (
        <Outlet />
    )
}

export default AuthChecker
