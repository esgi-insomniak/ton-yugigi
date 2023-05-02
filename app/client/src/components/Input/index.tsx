import React from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { VscEyeClosed, VscEye } from "react-icons/vsc";

interface InputProps<T extends FieldValues> {
    label?: string;
    placeholder?: string;
    name: Path<T>;
    register?: UseFormRegister<T>;
    error?: string;
    type?: "text" | "password" | "email";
    icons?: React.ReactNode;
    passwordIcon?: boolean;
}

export const Input = <T extends FieldValues>({
    label,
    placeholder = "",
    name,
    register,
    error,
    type = "text",
    icons,
    passwordIcon,
}: InputProps<T>) => {

    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
        <div className="flex flex-col group space-y-1">
            {label && <label htmlFor={name as string} className="font-bold text-sm tracking-wide">{label}</label>}
            <div className={`rounded-md pr-5 pl-3 py-3 bg-transparent border-gray-400 border flex items-center space-x-2 focus-within:text-blue-500 focus-within:border-blue-500`}>
                {icons}
                <input
                    className="bg-transparent outline-none w-full text-gray-600"
                    type={showPassword ? "text" : type}
                    placeholder={placeholder}
                    {...register && register(name)}
                />
                {passwordIcon && (
                    <div
                        className="cursor-pointer group-focus:text-red-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <VscEye />
                        ) : (
                            <VscEyeClosed />
                        )}
                    </div>
                )}
            </div>
            {error && <span className="text-red-500">{error}</span>}
        </div>
    );
};