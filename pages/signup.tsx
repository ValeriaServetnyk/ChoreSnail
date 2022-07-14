import { css } from '@emotion/react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getUserByValidSessionToken } from '../util/database';
import { RegisterResponseBody } from './api/register';

const messageStyles = css`
  font-family: Nunito;
`;

const pageLayout = css`
  min-height: 80vh;
`;

const errorMessageStyles = css`
  font-family: Nunito;
  color: rgba(226, 41, 41, 0.5);
`;

const buttonStyles = css`
  background-color: rgba(156, 85, 20, 1);
  border: none;
  font-size: 15px;
  margin-top: 60px;

  color: white;

  a {
    font-family: Nunito;
  }
  &:hover {
    background-color: rgba(156, 85, 20, 0.8);
  }
`;

const emptyButtonStyles = css`
  border-color: rgba(156, 85, 20, 1);

  font-size: 15px;
  margin-top: 60px;

  color: rgba(156, 85, 20, 1);

  &:hover {
    background-color: rgba(156, 85, 20, 0.3);
    border-color: rgba(156, 85, 20, 1);
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

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Signup(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const registerResponseBody: RegisterResponseBody =
      await registerResponse.json();
    // console.log(registerResponseBody);

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

      await props.refreshUserProfile();
      // by username
      await router.push(`/users/private-profile`);
      // await router.push(`/users/${registerResponseBody.user.username}`);
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
      <main css={pageLayout}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" css={titleStyles}>
              Please create your account
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  color="secondary"
                  id="name"
                  label="User name"
                  name="name"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.currentTarget.value);
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  color="secondary"
                  name="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              css={buttonStyles}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => registerHandler()}
            >
              <a>Create account</a>
            </Button>
            <div css={errorMessageStyles}>
              {errors.map((error) => (
                <span key={`error-${error.message}`}>{error.message}</span>
              ))}
            </div>
            <Button
              css={emptyButtonStyles}
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              href="/projectsNoauth"
            >
              Skip registration
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="login" css={messageStyles}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    return {
      redirect: {
        destination: `/users/private-profile`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
