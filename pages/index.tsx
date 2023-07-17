import React from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useUser from "@lib/client/useUser";
import useMutation from "@lib/client/useMutation";

interface ITweetForm {
  tweet: string;
}

export default () => {
  useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ITweetForm>();
  const [tweet, { isLoading }] = useMutation("api/tweet");

  const onValid = (tweetData: ITweetForm) => {
    if (isLoading) return;
    reset();
    tweet(tweetData);
  };

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
      <form onSubmit={handleSubmit(onValid)}>
        <textarea
          {...register("tweet", {
            required: "Please write more than 5 letters",
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
        <p>{errors?.tweet?.message || ""}</p>
        <button>Tweet!</button>
      </form>
    </Layout>
  );
};
