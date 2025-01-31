import { create } from 'zustand';
import { axiosInstance } from '@/lib/axiosConfig';
import { AxiosError, isAxiosError } from 'axios';
import toast from 'react-hot-toast';
interface AuthStore {
    authUserEmail: string | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isCheckingAuth: boolean;
    error: string | null;
    ranOnce: boolean;
    setAuthUserEmail: (email: string | null) => void;
    setIsSigningUp: (isSigningUp: boolean) => void;
    setIsLoggingIn: (isLoggingIn: boolean) => void;
    setIsCheckingAuth: (isCheckingAuth: boolean) => void;
    setError: (error: string | null) => void;
    setRanOnce: (ranOnce: boolean) => void;
}

interface ErrorResponse {
    detail: string;
}

export const useAuthStore = create<AuthStore>((set) => ({  
    authUserEmail: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,
    error: null,
    ranOnce: false,
    setAuthUserEmail: (email) => set({ authUserEmail: email }),
    setIsSigningUp: (isSigningUp) => set({ isSigningUp }),
    setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
    setIsCheckingAuth: (isCheckingAuth) => set({ isCheckingAuth }),
    setError:  (error) => set({ error }),
    setRanOnce: (ranOnce) => set({ ranOnce }),
}))

// useAuthStore.subscribe


export async function signUp(name: string, email: string, password: string) {
    const { setIsSigningUp, setError, setAuthUserEmail } = useAuthStore.getState();
    try {
        setIsSigningUp(true);
        const response = await axiosInstance.post('/users/signup', { name, email, password });
        if (response.status !== 200) {
            setError(response.data.detail)
            setAuthUserEmail(null);
            throw new Error('Failed to sign up');
        }
        setAuthUserEmail(email);
    }
    // check if error is of type AxiosError
    catch (error) {
        if (isAxiosError(error)) {
            const e = error as AxiosError;
                const errorMessage = (e.response?.data as ErrorResponse)?.detail || 'Failed to sign up';
                // const errorMessage = e.response?.data?.detail as string|| 'Failed to sign up';
                setError(errorMessage);
                // const ex = new AxiosError();
        }
        console.error(error);
        
    }
    finally {
        setIsSigningUp(false);
    }
}

export async function login(email: string, password: string) {
    const { setIsLoggingIn, setError, setAuthUserEmail } = useAuthStore.getState();
    try {
        setIsLoggingIn(true);
        const response = await axiosInstance.post('/users/login', { email, password });
        if (response.status !== 200) {
            setError(response.data.detail)
            setAuthUserEmail(null);
            throw new Error('Failed to log in');
        }
        setAuthUserEmail(email);
        console.log('successfully logged in')
    }
    catch (error) {
        if (isAxiosError(error)) {
            const e = error as AxiosError;
                const errorMessage = (e.response?.data as ErrorResponse)?.detail || 'Failed to sign up';
                // const errorMessage = e.response?.data?.detail as string|| 'Failed to sign up';
                setError(errorMessage);
                // const ex = new AxiosError();
        }
        console.error(error);
    }
    finally {
        setIsLoggingIn(false);
    }
}

export async function checkAuth() {
    const { setIsCheckingAuth, setAuthUserEmail } = useAuthStore.getState();
    try {
        setIsCheckingAuth(true);
        const response = await axiosInstance.get('/users/checkauth');
        if (response.status !== 200) {
            throw new Error('Failed to check auth');
        }
        setAuthUserEmail(response.data.email);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        setIsCheckingAuth(false);
    }
}

export async function logout() {
    const { setAuthUserEmail } = useAuthStore.getState();
    // setAuthUserEmail(null);
    try {
        const response = await axiosInstance.post('/users/logout');
        if (response.status !== 200) {
            throw new Error('Failed to log out');
        }
        setAuthUserEmail(null);
    }
    catch (error) {
        toast.error("Failed to log out");
        console.error(error);
    }
}

export enum AuthType {
    LOGIN = "login",
    SIGNUP = "signup",
}