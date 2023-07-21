import { SWRConfig } from "swr";
import "../global.css";
import { cls } from "@lib/client/utils";

export default function App({ Component, pageProps }: any) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div
        className={cls(
          "bg-slate-50 text-gray-900 w-full mx-auto",
          "dark:bg-gray-900 dark:text-slate-50"
        )}
      >
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}
