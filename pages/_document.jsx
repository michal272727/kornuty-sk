import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="sk">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF6B9D" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
