import { Head, Html, Main, NextScript } from 'next/document';

export default function MyDocument() {
  return (
    <Html>
      <Head>
        <link
          href="//fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="//fonts.googleapis.com/css2?family=Indie+Flower&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
