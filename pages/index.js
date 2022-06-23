import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home page</title>
        <meta name="home page" content="intro to the app and brief description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Home page
        </h1>
<Link href="/login">Login</Link>
<Link href="/signup">Sign Up</Link>
      </main>

    </div>
  )
}
