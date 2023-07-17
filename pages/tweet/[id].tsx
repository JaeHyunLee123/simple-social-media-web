import React from "react";
import Layout from "@components/layout";
import useSWR from "swr";
import { Tweet } from "@prisma/client";
import { useRouter } from "next/router";
interface ITweetWithLikesAndUser extends Tweet {
  _count: { likes: number };
  user: { username: string };
}

export default () => {
  const router = useRouter();
  const {} = useSWR<ITweetWithLikesAndUser>(
    router.query.id ? `/api/tweet/${router.query.id}` : null
  );

  return (
    <Layout>
      <h1>Tweet detail</h1>
    </Layout>
  );
};
