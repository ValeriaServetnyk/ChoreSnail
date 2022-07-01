import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';

const buttonStyles = css`
  background-color: rgba(156, 85, 20, 1);
  border: none;
  font-size: 15px;

  &:hover {
    background-color: rgba(156, 85, 20, 1);
  }
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Signup(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

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
      await router.push(`/users/${registerResponseBody.user.username}`);
      await props.refreshUserProfile();
      // await router.push(`/`);
    }
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
      <Container>
        <main>
          <h1>Please create your account</h1>
          <Card style={{ width: '18rem', height: '18rem' }}>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>
                    <label>
                      Username:{' '}
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
                      <input
                        value={password}
                        onChange={(event) => {
                          setPassword(event.currentTarget.value);
                        }}
                      />
                    </label>
                  </Form.Label>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  css={buttonStyles}
                  onClick={() => registerHandler()}
                >
                  Create account
                </Button>
                {errors.length &&
                  errors.map((error) => (
                    <span key={`error-${error.message}`}>{error.message}</span>
                  ))}
                <Button css={buttonStyles}>
                  <Link href="/projects">Skip registration</Link>
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </main>
      </Container>
    </div>
  );
}
