import { SWRConfig } from "swr";
import "../global.css";

export default function App({ Component, pageProps }: any) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="bg-slate-50 text-gray-900">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}
