import { css } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const buttonStyles = css`
  background-color: rgba(156, 85, 20, 1);
  border: none;
  font-size: 15px;

  &:hover {
    background-color: rgba(156, 85, 20, 0.8);
  }
`;

const titleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 30px;
  font-weight: medium;
  margin-top: 40px;
`;

const messageStyles = css`
  font-family: Nunito;
`;

const errorMessageStyles = css`
  font-family: Nunito;
  color: rgba(226, 41, 41, 0.5);
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};

const theme = createTheme();

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
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h1 css={titleStyles}>Login to access your profile</h1>

              <label>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="User name"
                  name="username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.currentTarget.value);
                  }}
                />
                {/* <input
                  value={username}
                  onChange={(event) => {
                    setUsername(event.currentTarget.value);
                  }}
                /> */}
              </label>
              <label>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                />
                {/* <input
                  value={password}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                /> */}
              </label>
              <div css={errorMessageStyles}>
                {errors.map((error) => (
                  <span key={`error-${error.message}`}>{error.message}</span>
                ))}
              </div>
              <Button
                css={buttonStyles}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => loginHandler()}
              >
                Login
              </Button>

              {/* <button onClick={() => loginHandler()}>Login</button> */}
              {/* {errors.length &&
                errors.map((error) => (
                  <span key={`error-${error.message}`}>{error.message}</span>
                ))} */}

              <Grid item>
                <Link href="signup" css={messageStyles}>
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Box>
          </Container>
        </ThemeProvider>
      </main>
    </div>
  );
}
