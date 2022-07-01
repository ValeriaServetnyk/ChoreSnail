import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

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
      await props.refreshUserProfile();
      await router.push(returnTo);
    } else {
      // redirect to user profile
      // by username
      await props.refreshUserProfile();
      await router.push(`/users/${loginResponseBody.user.username}`);
    }

    // by id
    //   await router.push(`/users/${loginResponseBody.user.id}`);
    // }
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
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
              <label>
                Username:{' '}
                <Form.Control type="username" placeholder="Enter your name" />
                <input
                  value={username}
                  onChange={(event) => {
                    setUsername(event.currentTarget.value);
                  }}
                />
              </label>
            </Form.Label>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>
              <label>
                Password:{' '}
                <Form.Control type="password" placeholder="Password" />
                <input
                  value={password}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                />
              </label>
            </Form.Label>
          </Form.Group>
          <Button variant="primary" type="submit">
            <button onClick={() => loginHandler()}>Login</button>
          </Button>
          {errors.length &&
            errors.map((error) => (
              <span key={`error-${error.message}`}>{error.message}</span>
            ))}
        </Form>
        <button>
          <Link href="/">
            <a>Back</a>
          </Link>
        </button>
      </main>
    </div>
  );
}
