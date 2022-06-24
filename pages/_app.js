import { css, Global } from '@emotion/react';
import Head from 'next/head';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return  (
    <>
    <Head>
    <link rel="icon" href="/favicon.ico" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/icon-apple-touch.png" />
<link rel="manifest" href="/manifest.json" />
    </Head>
      <Global
  styles={css`
  html,
body {
  background-color: rgba(229, 208, 153, 0.2);
  /* color: rgba(172, 93, 21, 1); */
  padding: 0;
  margin: 0;
  font-family: Nunito, Indie Flower, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
  `}
   />
   <Layout>
    <Component {...pageProps}/>
    </Layout>
   </>
  );
}

export default MyApp

// Component represents the content of every page of the app that is being rendered
//  Layout wraps all pages