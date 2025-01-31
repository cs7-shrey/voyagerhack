import React, { useState } from "react";
import { AuthType, useAuthStore } from "@/store/useAuthStore";
import { signUp, login } from "@/store/useAuthStore";
import { Link } from "react-router";
import { PulseLoader } from "react-spinners";

interface InputProps {
    label: string;
    type: string;
    id: string;
    placeholder?: string;
    value: string;
    setValue: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ label, type, id, placeholder, value, setValue }) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="text-xs font-bold">
                {label}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                required={true}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="block w-full rounded-xl bg-white px-3 py-2 text-base text-gray-900 border-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accentForeground sm:text-sm/6"
            />
        </div>
    );
};

interface FormProps {
    type: AuthType;
    typeText: string;
}
const Form: React.FC<FormProps> = ({ type, typeText}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    // let onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    const { error, isSigningUp, isLoggingIn } = useAuthStore();
    const onSubmit = (e: React.FormEvent<HTMLButtonElement>) =>  {
        e.preventDefault();
        if (!email || !password) {
            return;
        }
        if (type === AuthType.SIGNUP) {
            signUp(name, email, password);
        } else {
            login(email, password);
        }
    }
    return (
        <div className="w-full h-full flex flex-col gap-3">
            <h1 className="text-3xl pb-4 font-semibold font- text-center">
                {typeText}
            </h1>
            <form className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-4">
                    {type === AuthType.SIGNUP && <div>
                        <Input
                            label="Name"
                            type="text"
                            id="name"
                            placeholder={"Enter name"}
                            value={name}
                            setValue={setName}
                        />
                    </div>}
                    <div>
                        <Input
                            label="Email"
                            type="email"
                            id="email"
                            placeholder={"Enter email address"}
                            value={email}
                            setValue={setEmail}
                        />
                    </div>
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            setValue={setPassword}
                        />
                    </div>
                    <div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <div className="mx-auto my-2 w-full">
                        <button 
                            className="relative bg-accent text-white p-2 rounded-md w-full" onClick={onSubmit}
                            disabled={isSigningUp || isLoggingIn}
                    >
                            {typeText}
                            {(isSigningUp || isLoggingIn) && 
                            <div className="absolute inset-0 flex justify-center bg-secondary/80 items-center">
                                <PulseLoader size={10} color="white"/>
                            </div>}
                        </button>
                    </div>
                </div>
            </form>
            <div className="text-center">
                {type === AuthType.SIGNUP ? (
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="text-accent underline">
                            Login
                        </Link>
                    </p>
                ) : (
                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-accent underline">
                            Sign up
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Form;
