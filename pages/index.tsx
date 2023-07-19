import React from "react";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useUser from "@lib/client/useUser";
import useMutation from "@lib/client/useMutation";
import useSWR from "swr";
import { Tweet } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { cls } from "@lib/client/utils";

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
  const { data, mutate, isValidating } = useSWR<ITweetResponse>("/api/tweet");
  const [isTweeting, setIsTweeting] = useState(false);

  const onValid = (tweetData: ITweetForm) => {
    if (isLoading) return;
    reset();
    tweet(tweetData);
    if (data) mutate({ ...data }, true);
  };

  return (
    <Layout>
      {isValidating ? (
        <h2>Loading</h2>
      ) : (
        <div className="flex flex-col space-y-4">
          {data?.tweets.map((tweet) => (
            <Link href={`/tweet/${tweet.id}`} key={tweet.id}>
              <div>
                <div className="flex justify-between items-center w-full">
                  <h3 className="w-2/3 text-lg">{tweet.text}</h3>
                  <div className="w-1/3 flex flex-col items-end">
                    <span className="text-sm">{tweet.user.username}</span>
                    <p className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                      <span>{tweet._count.likes}</span>
                    </p>
                  </div>
                </div>
                <div className="border-b-2 w-full mt-2" />
              </div>
            </Link>
          ))}
        </div>
      )}
      <button onClick={() => setIsTweeting((prev) => !prev)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </button>
      <form
        className={cls(
          "transition-all fixed border border-black mx-auto left-0 right-0 w-4/5",
          isTweeting ? "bottom-2" : "-bottom-72"
        )}
        onSubmit={handleSubmit(onValid)}
      >
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
          rows={10}
        />
        <p>{errors?.tweet?.message || ""}</p>
        <button>Tweet!</button>
      </form>
    </Layout>
  );
};
