import React, { useEffect, useState } from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useMutation from "@lib/client/useMutation";
import { useRouter } from "next/router";
import type { ErrorMessage } from "@lib/server/withHandler";

interface ILoginForm {
  username: string;
  password: string;
}
interface IMutationResult {
  ok: boolean;
  error?: ErrorMessage;
}

export default () => {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setFocus,
  } = useForm<ILoginForm>({ mode: "all" });
  const [login, { result: mutationResult, isLoading }] =
    useMutation<IMutationResult>("/api/user/log-in");
  const [isUserExist, setIsUserExist] = useState(true);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);

  const onValid = (formData: ILoginForm) => {
    if (isLoading) return;
    login(formData);
  };

  useEffect(() => {
    if (mutationResult?.ok) router.replace("/");
    if (mutationResult?.error === "passwordIncorrect") {
      setIsPasswordCorrect(false);
      setFocus("password");
    }
    if (mutationResult?.error === "noUserExist") {
      setIsUserExist(false);
      setFocus("username");
    }
  }, [router, mutationResult]);

  return (
    <Layout>
      <h1>Log in</h1>
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
          onChange={() => setIsUserExist(true)}
        />
        <p>
          {isUserExist
            ? errors.username?.message || ""
            : "This username doesn't exist"}
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
          onChange={() => setIsPasswordCorrect(true)}
        />
        <p>
          {isPasswordCorrect
            ? errors?.password?.message || ""
            : "Incorrect password"}
        </p>
        <button>Log In</button>
      </form>
    </Layout>
  );
};
