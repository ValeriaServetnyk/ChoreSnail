import Head from 'next/head';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div>
      <Head>
        <title>User dashboard</title>

        <meta name="user dashboard" content="user`s past activity log" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-apple-touch.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main>
        <h1>My past projects</h1>
        <h1>My added chores</h1>
        <Link href="/">
          <a>Create new project</a>
        </Link>
      </main>
    </div>
  );
}
