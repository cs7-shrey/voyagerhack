import Form from "./Form";
import { AuthType } from "@/store/useAuthStore";
const SignUp = () => {
    return (
        <div className="bg-white w-full h-full flex justify-center items-center rounded-lg p-4">
            <Form type={AuthType.SIGNUP} typeText="Sign up" />
        </div>
    );
};

export default SignUp;
