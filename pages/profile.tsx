import React from "react";
import Layout from "@components/layout";
import useUser from "@lib/client/useUser";
import useSWR from "swr";

export default () => {
  useUser();

  const {} = useSWR("/api/profile");

  return (
    <Layout>
      <h1>Proflile</h1>
    </Layout>
  );
};
