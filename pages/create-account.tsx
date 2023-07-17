import React from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";

interface ISignUpForm {
  username: string;
  password: string;
  passwordConfirm: string;
}

export default () => {
  const { register } = useForm<ISignUpForm>();

  return (
    <Layout>
      <h1>Sign Up</h1>
      <form>
        <label htmlFor="username">Username</label>
        <input
          {...register("username", { required: "true" })}
          id="username"
          placeholder="Username"
        />
        <label htmlFor="password">Password</label>
        <input
          {...register("password", { required: "true" })}
          id="password"
          type="password"
        />
        <label htmlFor="passwordconfirm">Password Confirm</label>
        <input
          {...register("passwordConfirm", { required: "true" })}
          id="passwordconfirm"
          type="password"
        />
      </form>
    </Layout>
  );
};
