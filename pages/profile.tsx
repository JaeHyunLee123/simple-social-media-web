import React, { useState } from "react";
import Layout from "@components/layout";
import useUser from "@lib/client/useUser";
import useSWR from "swr";
import { Like, Tweet as ITweet, User } from "@prisma/client";
import { cls, formatDate } from "@lib/client/utils";
import Tweet from "@components/tweet";
interface ITweetWithLikesAndUser extends ITweet {
  _count: { likes: number };
  user: { username: string };
}
interface ILikeWithTweet extends Like {
  tweet: ITweetWithLikesAndUser;
}

interface IProfileResponse {
  ok: boolean;
  user: User;
  postedTweets: ITweetWithLikesAndUser[];
  likingTweets: ILikeWithTweet[];
}

export default () => {
  useUser();

  const [tweetsCategory, setTweetsCategory] = useState<"posted" | "liking">(
    "posted"
  );
  const { data } = useSWR<IProfileResponse>("/api/profile");

  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-2">{`${data?.user.username}'s proflile`}</h1>
      <span className="mb-2 block">{`Signed at ${formatDate(
        data?.user.createdAt.toString() || ""
      )}`}</span>
      <hr />
      <div className="flex justify-around py-2">
        <button
          onClick={() => {
            setTweetsCategory("posted");
          }}
          className={cls(
            tweetsCategory === "posted"
              ? "text-red-500 text-xl font-semibold"
              : ""
          )}
        >
          Posted
        </button>
        <button
          onClick={() => {
            setTweetsCategory("liking");
          }}
          className={cls(
            tweetsCategory === "liking"
              ? "text-red-500 text-xl font-semibold"
              : ""
          )}
        >
          Liking
        </button>
      </div>
      <div
        className={cls(
          "flex flex-col space-y-4",
          "md:grid md:grid-cols-2 md:gap-2",
          "lg:grid-cols-3"
        )}
      >
        {tweetsCategory === "posted"
          ? data?.postedTweets.map((tweet) => (
              <Tweet tweet={tweet} key={tweet.id}></Tweet>
            ))
          : data?.likingTweets.map((like) => (
              <Tweet key={like.id} tweet={like.tweet}></Tweet>
            ))}
      </div>
    </Layout>
  );
};
