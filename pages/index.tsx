import React from "react";
import Layout from "@components/layout";

export default () => (
  <Layout>
    <h1>Home</h1>
    {[1, 2, 3, 4, 5].map((_, i) => (
      <div key={i}>
        <h3>Dummy user</h3>
        <span>Dummy tweet</span>
        <hr />
      </div>
    ))}
  </Layout>
);
