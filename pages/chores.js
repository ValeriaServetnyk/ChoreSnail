import Head from 'next/head';
import Link from 'next/link';
import { getChores, getUserByValidSessionToken } from '../util/database';

export default function Chores(props) {
  return (
    <div>
      <Head>
        <title>Add chores</title>

        <meta name="list of chores" content="add chores to your project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Pick chores</h1>
        <div>
          {props.chores.map((chore) => {
            return (
              <div key={`chore-${chore.id}`}>
                <div>Name: {chore.name}</div>
                <div>Weight:{chore.weight}</div>
                <div>Created by:{chore.creator_id}</div>
              </div>
            );
          })}
        </div>
        <div>
          <Link href="/login">
            <a>Back</a>
          </Link>
          <Link href="/signup">
            <a>Create project</a>
          </Link>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const chores = await getChores();
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    return {
      props: {
        chores: chores,
      },
    };
  }
  return {
    redirect: {
      destination: `/login?returnTo=/chores`,
      permanent: false,
    },
  };
}

// anything in gsp run on the server
// props are passed to the function Chores - pass props when adding gsp to the function top as well as to the map function props.chores.map
