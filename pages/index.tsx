import React from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useUser from "@lib/client/useUser";

interface ITweetForm {
  tweet: string;
}

export default () => {
  //const { user } = useUser();
  const { register } = useForm<ITweetForm>();

  return (
    <Layout>
      <h1>Home</h1>
      {[1, 2, 3].map((_, i) => (
        <div key={i}>
          <h3>Dummy user</h3>
          <span>Dummy tweet</span>
          <hr />
        </div>
      ))}
      <form>
        <textarea
          {...register("tweet", {
            required: "true",
            minLength: {
              value: 5,
              message: "Please write more than 5 letters",
            },
            maxLength: {
              value: 300,
              message: "Please write less than 300 letters",
            },
          })}
        />
        <button>Tweet!</button>
      </form>
    </Layout>
  );
};
