import React, { useEffect, useState } from "react";
import Layout from "@components/layout";
import useSWR from "swr";
import { Tweet } from "@prisma/client";
import { useRouter } from "next/router";
import { formatDate } from "@lib/client/utils";
import useMutation from "@lib/client/useMutation";
import { cls } from "@lib/client/utils";
import useUser from "@lib/client/useUser";

interface ITweetWithLikesAndUser extends Tweet {
  _count: { likes: number };
  user: { username: string };
}

interface ITweetResponse {
  ok: boolean;
  tweet: ITweetWithLikesAndUser;
  isLike: boolean;
}

export default () => {
  useUser();
  const router = useRouter();
  const { data, isValidating, mutate } = useSWR<ITweetResponse>(
    router.query.id ? `/api/tweet/${router.query.id}` : null
  );
  const [toggleLike, { isLoading }] = useMutation(
    router.query.id ? `/api/tweet/${router.query.id}/likes` : ""
  );
  const [likes, setLikes] = useState(-1);

  useEffect(() => {
    if (data && likes === -1) setLikes(data.tweet._count.likes);
  }, [data]);

  const onLikeClick = () => {
    if (isLoading || !data) return;
    toggleLike({});
    mutate({ ...data, isLike: !data.isLike }, false);
    data.isLike ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  return (
    <Layout>
      {isValidating ? (
        <h2>Loading</h2>
      ) : (
        <div className="flex flex-col space-y-2">
          <p className="font-bold text-xl">{data?.tweet.user.username}</p>
          <p
            className={cls(
              "bg-white text-lg px-4 py-2  rounded ",
              " dark:bg-slate-700"
            )}
          >
            {data?.tweet.text}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={onLikeClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={data?.isLike ? "red" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={cls(
                    "w-6 h-6",
                    data?.isLike
                      ? "text-red-500"
                      : "text-black dark:text-white "
                  )}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
              <span>{likes}</span>
            </div>
            <p className="text-sm">
              {formatDate(data?.tweet.updatedAt.toString() || "")}
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};
