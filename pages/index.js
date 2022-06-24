import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home page</title>

        <meta name="home page" content="intro to the app and brief description" />
        <link rel="icon" href="/favicon.ico" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/icon-apple-touch.png" />
<link rel="manifest" href="/manifest.json" />
      </Head>
      <main>
        <h1>
        End inequality when
it comes to house chores
        </h1>
        <Link href="/login"><a>Login</a></Link>
<Link href="/signup"><a>Sign Up</a></Link>
        <div>
          <div>
          <ul>
            <li>Create your house project</li>
            <li>Assign participants to your project</li>
            <li>Add chores to the list</li>
            <li>Divide chores equally among participants</li>
          </ul>
          </div>
          <div>
          <Link href="/login"><a>Let`s get started!</a></Link>
          </div>
        </div>
      </main>
    </div>
  )
}
