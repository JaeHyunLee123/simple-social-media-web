import React, { useEffect, useState } from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useMutation from "lib/client/useMutation";
import { useRouter } from "next/router";
import type { ErrorMessage } from "@lib/server/withHandler";
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
    <Layout>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onValid)}>
        <label htmlFor="username">Username</label>
        <input
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 5,
              message: "Username should be longer than 5 letters",
            },
          })}
          id="username"
          placeholder="Super Duper Nickname"
          onChange={() => setIsUsernameExist(false)}
        />
        <p>
          {isUsernameExist
            ? "This username is already exist"
            : errors.username?.message || ""}
        </p>
        <label htmlFor="password">Password</label>
        <input
          {...register("password", {
            required: "Password is required",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password should be longer than 8 letters and has at least one upppercase, one lowercase, one number and one special character",
            },
          })}
          id="password"
          type="password"
        />
        <p>{errors?.password?.message || ""}</p>
        <label htmlFor="passwordconfirm">Password Confirmation</label>
        <input
          {...register("passwordConfirm", {
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
          id="passwordconfirm"
          type="password"
        />
        <p>{errors?.passwordConfirm?.message || ""}</p>
        <button>Sign Up</button>
      </form>
    </Layout>
  );
};
