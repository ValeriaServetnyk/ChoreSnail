import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getChores } from '../util/database';

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
                <div>{chore.name}</div>
                <div>Weight:{chore.weight}</div>
                <Image
                  src={`/${chore.iconName}.png`}
                  width="100"
                  height="100"
                  alt="chore icons"
                />
                {/* <div>Created by:{chore.creator_id}</div> */}
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

export async function getServerSideProps() {
  const chores = await getChores();

  return {
    props: {
      chores: chores,
    },
  };
}

// anything in gsp run on the server
// props are passed to the function Chores - pass props when adding gsp to the function top as well as to the map function props.chores.map
