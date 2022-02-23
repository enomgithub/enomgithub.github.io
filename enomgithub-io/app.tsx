import React, { FC } from "https://esm.sh/react@17.0.2";
import "./css/green.css";

export default function App(
  { Page, pageProps }: { Page: FC; pageProps: Record<string, unknown> },
) {
  return (
    <main>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <Page {...pageProps} />
    </main>
  );
}
