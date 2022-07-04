import { css } from '@emotion/react';
import { Button, Container } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getUserByValidSessionToken } from '../../util/database';

const pageLayout = css`
  min-height: 80vh;
`;

const titleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 40px;
  font-weight: medium;
  margin-top: 80px;
  margin-bottom: 0px;
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

type Props = {
  user?: {
    id: number;
    username: string;
  };
};

export default function UserDashboard(props: Props) {
  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta
            name="user not found"
            content="no such user exists, please register"
          />
        </Head>
        <main>
          <h1>User not found, please register</h1>
        </main>
      </>
    );
  }

  return (
    <div css={pageLayout}>
      <Container>
        <Head>
          <title>{props.user.username}</title>

          <meta name="user dashboard" content="user`s past activity log" />
        </Head>
        <main>
          <h1 css={titleStyles}>
            Welcome to you dashboard {props.user.username}
          </h1>
          {/* <div>id: {props.user.id}</div>
        <div>username: {props.user.username}</div> */}
          <h1>My past projects</h1>
          <h1>My added chores</h1>
          <Button css={buttonStyles} href="/projects">
            <a>Create new project</a>
          </Button>
        </main>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    return {
      props: {
        user: user,
      },
    };
  }
  return {
    redirect: {
      destination: `/login?returnTo=/users/private-profile`,
      permanent: false,
    },
  };
}
