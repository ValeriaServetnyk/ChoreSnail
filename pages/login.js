import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const loginResponseBody = await loginResponse.json();
    console.log(loginResponseBody);

    // if there is an error
    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return;
    }

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      // validate returnTo parameter against valid path
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await router.push(returnTo);
    } else {
      // redirect to user profile

      // by username
      //   await router.push(`/users/${loginResponseBody.user.username}`);
      // }

      // by id
      await router.push(`/users/${loginResponseBody.user.id}`);
    }
  }
  return (
    <div>
      <Head>
        <title>Login page</title>
        <meta
          name="Login page"
          content="please add your credential to access your user dashboard"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Login to create projects</h1>
        <label>
          Username:{' '}
          <input
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Password:{' '}
          <input
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
        </label>
        <button onClick={() => loginHandler()}>Login</button>
        {errors.length &&
          errors.map((error) => (
            <span key={`error-${error.message}`}>{error.message}</span>
          ))}

        <button>
          <Link href="/index">
            <a>Back</a>
          </Link>
        </button>
      </main>
    </div>
  );
}
