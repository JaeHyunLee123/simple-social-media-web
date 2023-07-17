import { SWRConfig } from "swr";
//import "../global.css";
import Head from "next/head";

export default function App({ Component, pageProps }: any) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <>
        <Head>
          <link //water.css
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
          />
        </Head>
        <Component {...pageProps} />
      </>
    </SWRConfig>
  );
}
