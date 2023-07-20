import React, { useEffect, useState } from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useMutation from "lib/client/useMutation";
import { useRouter } from "next/router";
import type { ErrorMessage } from "@lib/server/withHandler";
import Input from "@components/input";
interface ISignUpForm {
  username: string;
  password: string;
  passwordConfirm: string;
}

interface IMutationResult {
  ok: boolean;
  error?: ErrorMessage;
}

export default () => {
  const router = useRouter();
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
    setFocus,
  } = useForm<ISignUpForm>({ mode: "all" });
  const [signup, { result: mutationResult, isLoading }] =
    useMutation<IMutationResult>("/api/user/sign-in");
  const [isUsernameExist, setIsUsernameExist] = useState(false);

  const onValid = (formData: ISignUpForm) => {
    if (isLoading) return;
    signup(formData);
  };

  useEffect(() => {
    if (mutationResult?.ok) router.push("/log-in");
    if (mutationResult?.error === "usernameAlreadyExist") {
      setFocus("username");
      setIsUsernameExist(true);
    }
  }, [mutationResult, router]);

  return (
    <Layout isLogedIn={false}>
      <div className="flex flex-col items-center w-full">
        <h1 className="font-bold text-5xl mb-10">Sign Up</h1>
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col items-center space-y-3 w-4/5 max-w-[450px]"
        >
          <Input
            name="username"
            label="Username"
            placeholder="Super duper username"
            register={register("username", {
              required: "Username is required",
              minLength: {
                value: 5,
                message: "Username should be longer than 5 letters",
              },
            })}
            onChange={() => setIsUsernameExist(false)}
            isError={isUsernameExist || !!errors.username}
            errorMessage={
              isUsernameExist
                ? "This username is already exist"
                : errors.username?.message || ""
            }
          />

          <Input
            name="password"
            label="Password"
            register={register("password", {
              required: "Password is required",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password should be longer than 8 letters and has at least one upppercase, one lowercase, one number and one special character",
              },
            })}
            isError={!!errors.password}
            errorMessage={errors?.password?.message}
            type="password"
          />

          <Input
            name="passwordConfirm"
            label="Passwrod Confirmation"
            register={register("passwordConfirm", {
              required: "Password confirmation is required",
              validate: {
                isPasswordSame: () => {
                  const [original, confrim] = getValues([
                    "password",
                    "passwordConfirm",
                  ]);
                  return (
                    original === confrim || "Password cofirmation isn't same"
                  );
                },
              },
            })}
            isError={!!errors.passwordConfirm}
            errorMessage={errors?.passwordConfirm?.message}
            type="password"
          />

          <button className="text-white shadow px-4 py-2 bg-blue-300 rounded dark:bg-blue-800">
            Sign Up
          </button>
        </form>
      </div>
    </Layout>
  );
};
