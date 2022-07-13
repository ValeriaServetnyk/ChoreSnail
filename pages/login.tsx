import { css } from '@emotion/react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';

const pageLayout = css`
  min-height: 80vh;
`;

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
  font-family: Nunito;
  margin-bottom: 40px;
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

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const loginResponseBody: LoginResponseBody = await loginResponse.json();
    // console.log(loginResponseBody);

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
      await router.push(`/users/private-profile`);
      // await router.push(`/users/${loginResponseBody.user.username}`);
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
      <Container component="main" maxWidth="xs">
        <main css={pageLayout}>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" css={titleStyles}>
              Login to access your profile
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <div css={errorMessageStyles}>
                {errors.map((error) => (
                  <span key={`error-${error.message}`}>{error.message}</span>
                ))}
              </div>
            </Grid>
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
              <Link href="/signup" css={messageStyles}>
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Box>
        </main>
      </Container>
    </div>
  );
}
