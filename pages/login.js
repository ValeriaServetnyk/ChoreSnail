import Head from 'next/head';
import Link from 'next/link';

export default function Login() {
  return (
    <div>
      <Head>
        <title>Login page</title>
        <meta name="Login page" content="please add your credential to access your user dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Login to access your profile
        </h1>
<Link href="/index"><a>Back</a></Link>
<Link href="/signup"><a>Sign Up</a></Link>
      </main>

    </div>
  )
}