import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const router = useRouter();

  async function registerHandler() {
    const registerResponse = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const registerResponseBody = await registerResponse.json();
    console.log(registerResponseBody);

    // if there is an error
    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
      return;
    }

    // redirect user to dashboard after successful registration
    await router.push('/dashboard');
  }
  return (
    <div>
      <Head>
        <title>Sign up page</title>
        <meta
          name="sign up page"
          content="please register to create your profile and use the app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Please create your account</h1>
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
        <button onClick={() => registerHandler()}>Create account</button>
        {errors.length &&
          errors.map((error) => (
            <span key={`error-${error.message}`}>{error.message}</span>
          ))}
        <button>Skip registration</button>
        <button>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </button>
        <button>
          <Link href="/index">
            <a>Back</a>
          </Link>
        </button>
      </main>
    </div>
  );
}
