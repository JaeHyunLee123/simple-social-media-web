import React from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useUser from "@lib/client/useUser";
import useMutation from "@lib/client/useMutation";
import useSWR from "swr";
import { Tweet, User } from "@prisma/client";

interface ITweetForm {
  tweet: string;
}

interface ITweetWithLikesAndUser extends Tweet {
  _count: { likes: number };
  user: { username: string };
}

interface ITweetResponse {
  ok: boolean;
  tweets: ITweetWithLikesAndUser[];
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
  const { data } = useSWR<ITweetResponse>("/api/tweet");

  const onValid = (tweetData: ITweetForm) => {
    if (isLoading) return;
    reset();
    tweet(tweetData);
  };

  return (
    <Layout>
      <h1>Home</h1>
      {data?.tweets.map((tweet) => (
        <div key={tweet.id}>
          <h3>{tweet.text}</h3>
          <span>{tweet.user.username}</span>
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
