import { css } from '@emotion/react';
import AspectRatio from '@mui/joy/AspectRatio';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Checkbox, Container } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  getChores,
  getParticipantsByProjectId,
  getProjectById,
} from '../../../util/database';

type Props = {
  chores: Chore[];
  project: Project[];
};

type Chore = {
  id: number;
  name: string;
  weight: number;
  creatorId: number;
  iconName: string;
};

type Project = {
  id: number;
  projectName: string;
  creatorId: number;
};

const choreTitleStyles = css`
  font-family: Nunito;
  font-size: 20px;
  font-weight: medium;
`;

const pageLayout = css`
  min-height: 100vh;
`;

const choreCardContainer = css`
  text-align: right;
`;

const checkboxStyles = css`
  color: rgba(156, 85, 20, 1);

  .checked {
    color: rgba(156, 85, 20, 1);
  }
`;

const titleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 40px;
  font-weight: medium;
  margin-top: 80px;
  margin-bottom: 30px;
  font-family: Nunito;
`;

export default function Chores(props: Props) {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <div>
      <Head>
        <title>Add chores</title>

        <meta name="list of chores" content="add chores to your project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <main css={pageLayout}>
          <h1 css={titleStyles}>Pick chores for {props.project.projectName}</h1>

          <Sheet
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              width: 350,
              borderRadius: 'sm',
            }}
          >
            <List sx={{ py: 'var(--List-divider-gap)' }}>
              {props.chores.map((chore) => {
                return (
                  <div key={`chore-${chore.id}`}>
                    <ListItem>
                      <ListItemButton sx={{ gap: 2 }}>
                        <AspectRatio
                          sx={{
                            flexBasis: 180,
                            borderRadius: 'sm',
                            overflow: 'auto',
                          }}
                        >
                          <Image
                            src={`/${chore.iconName}.png`}
                            width="100"
                            height="100"
                            alt="chore icons"
                          />
                        </AspectRatio>
                        <ListItemContent css={choreCardContainer}>
                          <Typography css={choreTitleStyles}>
                            {chore.name}
                          </Typography>
                          <Checkbox
                            css={checkboxStyles}
                            {...label}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                          />
                        </ListItemContent>
                        {/*
                      <Typography>
                        Weight:{chore.weight}
                      </Typography>
                     */}

                        {/* <div>Created by:{chore.creator_id}</div> */}
                      </ListItemButton>
                    </ListItem>
                    <ListDivider />
                  </div>
                );
              })}
            </List>
          </Sheet>
        </main>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chores = await getChores();
  const project = await getProjectById(context.query.projectId);
  const participants = await getParticipantsByProjectId(
    context.query.projectId,
  );

  return {
    props: {
      chores: chores,
      project: project,
      participants: participants,
    },
  };
}

// anything in gsp run on the server
// props are passed to the function Chores - pass props when adding gsp to the function top as well as to the map function props.chores.map

// export default function Chores(props: Props) {
//   return (
//     <div>
//       <Head>
//         <title>Add chores</title>

//         <meta name="list of chores" content="add chores to your project" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main>
//         <h1>Pick chores for your project</h1>
//         <div>
//           {props.chores.map((chore) => {
//             return (
//               <div key={`chore-${chore.id}`}>
//                 <div>{chore.name}</div>
//                 <div>Weight:{chore.weight}</div>
//                 <Image
//                   src={`/${chore.iconName}.png`}
//                   width="100"
//                   height="100"
//                   alt="chore icons"
//                 />
//                 {/* <div>Created by:{chore.creator_id}</div> */}
//               </div>
//             );
//           })}
//         </div>
//         <div>
//           <Link href="/login">
//             <a>Back</a>
//           </Link>
//           <Link href="/signup">
//             <a>Create project</a>
//           </Link>
//         </div>
//       </main>
//     </div>
//   );
// }

// export async function getServerSideProps() {
//   const chores = await getChores();

//   return {
//     props: {
//       chores: chores,
//     },
//   };
// }
