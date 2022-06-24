import Head from 'next/head';
import Link from 'next/link';

export default function Signup() {
  return (
    <div>
      <Head>
        <title>Sign up page</title>
        <meta name="sign up page" content="please register to create your profile and use the app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Please create your account
        </h1>
<Link href="/login"><a>Login</a></Link>
<Link href="/index"><a>Back</a></Link>
      </main>

    </div>
  )
}