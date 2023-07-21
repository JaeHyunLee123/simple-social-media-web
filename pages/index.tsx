import React, { useEffect } from "react";
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
    setTimeout(() => {
      mutate();
    }, 500);
  };

  useEffect(() => {
    if (isTweeting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isTweeting]);

  return (
    <Layout>
      {isValidating ? (
        <h2>Loading</h2>
      ) : (
        <div
          className={cls(
            "flex flex-col space-y-4",
            "md:grid md:grid-cols-2 md:gap-2",
            "lg:grid-cols-3"
          )}
        >
          {data?.tweets.map((tweet) => (
            <Link href={`/tweet/${tweet.id}`} key={tweet.id}>
              <div
                className={cls(
                  "bg-white rounded-lg shadow px-4 py-2",
                  "dark:bg-slate-700"
                )}
              >
                <div
                  className={cls(
                    "flex justify-between items-center w-full",
                    "md:flex-col"
                  )}
                >
                  <h3 className="w-2/3 text-lg truncate md:w-full">
                    {tweet.text}
                  </h3>
                  <div
                    className={cls(
                      "w-1/3 flex flex-col items-end",
                      "md:flex-row md:justify-between md:w-full"
                    )}
                  >
                    <span className="text-sm ">{tweet.user.username}</span>
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
              </div>
            </Link>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsTweeting((prev) => !prev)}
        className={cls(
          "rounded-full p-2 bg-blue-300 shadow-lg fixed right-4 transition-all",
          isTweeting ? "bottom-[52%] rotate-45" : "bottom-2",
          "dark:bg-blue-700"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      <form
        className={cls(
          "rounded-2xl transition-all fixed right-[50%] translate-x-[50%]  w-11/12 bg-blue-200 h-1/2 flex flex-col justify-center items-center p-2 space-y-2 max-h-[50%] max-w-lg",
          isTweeting ? "bottom-2 md:right-4" : "-bottom-full  md:-right-full ",
          "dark:bg-zinc-700",
          "md:w-1/2 md:translate-x-0"
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
          className="rounded w-4/5 focus:outline-none px-2 py-1  dark:bg-gray-600"
        />
        <p className="text-sm text-red-500">{errors?.tweet?.message || ""}</p>
        <button
          className={cls(
            "bg-blue-300 shadow text-slate-50 px-4 w-2/3 py-2 rounded ring ring-offset-2 ring-blue-400",
            "dark:bg-blue-800 dark:ring-blue-900"
          )}
        >
          Tweet!
        </button>
      </form>
    </Layout>
  );
};
