import Form from "./Form";
import { AuthType, useAuthStore } from "@/store/useAuthStore";
import { Navigate } from 'react-router';

const Login = () => {
    const { authUserEmail } = useAuthStore();
    if (authUserEmail) {
        return <Navigate to="/" />
    }
    return (
        <div className="bg-white w-full h-full flex justify-center items-center rounded-lg p-4">
            <Form type={AuthType.LOGIN} typeText="Login" />
        </div>
    )
}

export default Login;
