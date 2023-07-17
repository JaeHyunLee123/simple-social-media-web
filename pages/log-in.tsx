import React from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";

interface ILoginForm {
  username: string;
  password: string;
}

export default () => {
  const {
    register,
    formState: { errors },
  } = useForm<ILoginForm>({ mode: "all" });

  return (
    <Layout>
      <h1>Log in</h1>
      <form>
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
        />
        <p>{errors.username?.message || ""}</p>
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
        <button>Log In</button>
      </form>
    </Layout>
  );
};
