import React from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";

interface ISignUpForm {
  username: string;
  password: string;
  passwordConfirm: string;
}

export default () => {
  const {
    register,
    watch,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<ISignUpForm>({ mode: "all" });

  const onValid = (formData: ISignUpForm) => {
    console.log(watch());
  };

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
          placeholder="Username"
        />
        <p>{errors?.username?.message || ""}</p>
        <label htmlFor="password">Password</label>
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password should be longer than 8 letters",
            },
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
        <button>Sign in</button>
      </form>
    </Layout>
  );
};
