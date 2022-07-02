// import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getUserByValidSessionToken } from '../../util/database';

export default function UserDashboard(props) {
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
          <Link href="/login">
            <a>Login</a>
          </Link>
          <Link href="/login">
            <a>SignIn</a>
          </Link>
        </main>
      </>
    );
  }

  return (
    <div>
      <Head>
        <title>{props.user.username}</title>

        <meta name="user dashboard" content="user`s past activity log" />
      </Head>
      <main>
        <h1>
          User #{props.user.id} (username: {props.user.username})
        </h1>
        <div>id: {props.user.id}</div>
        <div>username: {props.user.username}</div>
        <h1>My past projects</h1>
        <h1>My added chores</h1>
        <Link href="projects">
          <a>Create new project</a>
        </Link>
        <Link href="/login">
          <a>Go back to login</a>
        </Link>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
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
