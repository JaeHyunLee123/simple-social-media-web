import { cls } from "@lib/client/utils";
import { ChangeEventHandler } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface IInputProps {
  name: string;
  register?: UseFormRegisterReturn;
  type?: "text" | "password";
  label?: string;
  isError?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  errorMessage?: string;
}

const Input = ({
  name,
  register,
  type = "text",
  label,
  placeholder,
  onChange,
  isError = false,
  errorMessage,
}: IInputProps) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name}>{label}</label>
      <input
        {...register}
        id={name}
        placeholder={placeholder}
        onChange={onChange}
        className={cls(
          "px-4 py-2 border border-blue-400 rounded focus:outline-none focus:border-2 text-black",
          isError ? "border-red-500" : ""
        )}
        type={type}
      />
      <p className="text-red-500 text-sm">{errorMessage}</p>
    </div>
  );
};

export default Input;
