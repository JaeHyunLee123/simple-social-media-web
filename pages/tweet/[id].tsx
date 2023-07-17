import React from "react";
import Layout from "@components/layout";
import useSWR from "swr";
import { Tweet } from "@prisma/client";
import { useRouter } from "next/router";
import { formatDate } from "@lib/client/utils";
interface ITweetWithLikesAndUser extends Tweet {
  _count: { likes: number };
  user: { username: string };
}

interface ITweetResponse {
  ok: boolean;
  tweet: ITweetWithLikesAndUser;
}

export default () => {
  const router = useRouter();
  const { data, isValidating } = useSWR<ITweetResponse>(
    router.query.id ? `/api/tweet/${router.query.id}` : null
  );

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
          <p>{`Likes: ${data?.tweet._count.likes}`}</p>
        </div>
      )}
    </Layout>
  );
};
