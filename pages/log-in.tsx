import React, { useEffect, useState } from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useMutation from "@lib/client/useMutation";
import { useRouter } from "next/router";
import type { ErrorMessage } from "@lib/server/withHandler";
import { cls } from "@lib/client/utils";
import Input from "@components/input";

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
    router.replace("/");
  };

  useEffect(() => {
    if (mutationResult?.ok) router.replace("/");
    if (mutationResult?.error === "passwordIncorrect") {
      setIsPasswordCorrect(false);
      setFocus("password");
    }
    if (mutationResult?.error === "noExist") {
      setIsUserExist(false);
      setFocus("username");
    }
  }, [router, mutationResult]);

  return (
    <Layout isLogedIn={false}>
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-5xl mb-10">Log In</h1>
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
              maxLength: {
                value: 20,
                message: "Username should be shorter than 20 letters",
              },
            })}
            onChange={() => {
              setIsUserExist(true);
            }}
            isError={!isUserExist || !!errors.username}
            errorMessage={
              isUserExist
                ? errors.username?.message || ""
                : "This username doesn't exist"
            }
          />

          <Input
            name="password"
            label="Password"
            type="password"
            register={register("password", {
              required: "Password is required",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password should be longer than 8 letters and has at least one upppercase, one lowercase, one number and one special character",
              },
            })}
            isError={!isPasswordCorrect || !!errors.password}
            onChange={() => setIsPasswordCorrect(true)}
            errorMessage={
              isPasswordCorrect
                ? errors?.password?.message || ""
                : "Incorrect password"
            }
          />
          <button className="text-white shadow px-4 py-2 bg-blue-300 rounded">
            Log In
          </button>
        </form>
      </div>
    </Layout>
  );
};
