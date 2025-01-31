import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'
import { checkAuth } from '@/store/useAuthStore'
import { PulseLoader } from 'react-spinners'    

const AuthChecker = () => {
    const { isCheckingAuth, setIsCheckingAuth } = useAuthStore();
    const [canProcess, setCanProcess] = useState(false);
    useEffect(() => {
        setIsCheckingAuth(true)
        checkAuth()
        setCanProcess(true);
    }, [setIsCheckingAuth])
    if (!canProcess || isCheckingAuth) {
        return (
            <div className='absolute top-0 left-0 inset-0 bg-secondary/10 flex flex-col justify-center items-center'>
                <PulseLoader />
            </div>
        )
    }
    return (
        <Outlet />
    )
}

export default AuthChecker
