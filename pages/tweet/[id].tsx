import React, { useEffect, useState } from "react";
import Layout from "@components/layout";
import useSWR from "swr";
import { Tweet } from "@prisma/client";
import { useRouter } from "next/router";
import { formatDate } from "@lib/client/utils";
import useMutation from "@lib/client/useMutation";
import tweet from "pages/api/tweet";
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
  const router = useRouter();
  const { data, isValidating, mutate } = useSWR<ITweetResponse>(
    router.query.id ? `/api/tweet/${router.query.id}` : null
  );
  const [toggleLike, { isLoading }] = useMutation(
    router.query.id ? `/api/tweet/${router.query.id}/likes` : ""
  );
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (data) setLikes(data.tweet._count.likes);
  }, [data]);

  const onLikeClick = () => {
    if (isLoading || !data) return;
    toggleLike({});
    data.isLike ? setLikes((prev) => prev + 1) : setLikes((prev) => prev - 1);
    mutate({ ...data, isLike: !data.isLike }, false);
  };

  return (
    <Layout>
      {isValidating ? (
        <h2>Loading</h2>
      ) : (
        <div>
          <p>{data?.tweet.text}</p>
          <p>{`Written by ${data?.tweet.user.username}`}</p>
          <p>{`Updated at ${formatDate(
            data?.tweet.updatedAt.toString() || ""
          )}`}</p>
          <p>{`Likes: ${likes}`}</p>
          <button onClick={onLikeClick}>
            {data?.isLike ? "Unlike" : "Like"}
          </button>
        </div>
      )}
    </Layout>
  );
};
