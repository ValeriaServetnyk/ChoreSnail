import { css } from '@emotion/react';
import CircleIcon from '@mui/icons-material/Circle';
import AspectRatio from '@mui/joy/AspectRatio';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import Sheet from '@mui/joy/Sheet';
// import Typography from '@mui/joy/Typography';
import {
  Breadcrumbs,
  Button,
  Checkbox,
  Container,
  Typography,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  getChores,
  getParticipantsByProjectId,
  getProjectById,
  getValidSessionByToken,
} from '../../../util/database';

type Props = {
  chores: Chore[];
  project: Project;
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
  font-size: 18px;
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

const mediumLoadIcon = css`
  color: #fff200;
`;

const choreElement = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const titleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 40px;
  font-weight: medium;
  margin-top: 80px;
  margin-bottom: 60px;
  font-family: Nunito;
`;

const buttonStyles = css`
  background-color: rgba(156, 85, 20, 1);
  border: none;
  margin-top: 40px;
  margin-bottom: 40px;
  color: white;
  font-family: Nunito;
  font-size: 20px;

  &:hover {
    background-color: rgba(156, 85, 20, 0.8);
  }
`;

const buttonContainer = css`
  display: flex;
  justify-content: center;
`;

const breadcrumbsStyles = css`
  font-family: Nunito;
`;

export default function Chores(props: Props) {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const [projectChore, setProjectChore] = useState<Chore[]>([]);

  if ('errors' in props) {
    return <h1>Chores are not available</h1>;
  }

  const handleToggle = (id: number) => () => {
    const currentIndex = projectChore.indexOf(id);
    const newChecked = [...projectChore];
    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setProjectChore(newChecked);
  };

  const router = useRouter();

  async function createChoreHandler() {
    const response = await fetch(`/api/projects/${props.project.id}/chores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        choreId: projectChore,
        projectId: props.project.id,
      }),
    });

    const createdList = await response.json();

    // if ('errors' in createdProject) {
    //   setErrors(createdProject.errors);
    //   return;
    // }
    const newState = [...createdList, projectChore];

    setProjectChore(newState);
    await router.push(`/projects/${props.project.id}/projectDashboard`);
  }

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
          <Breadcrumbs aria-label="breadcrumb" css={breadcrumbsStyles}>
            <Link color="inherit" href="/users/private-profile">
              Dashboard
            </Link>
            <Link color="inherit" href={`/projects/${props.project.id}`}>
              Add Participants
            </Link>
            <Typography css={breadcrumbsStyles} color="text.primary">
              Add Chores
            </Typography>
          </Breadcrumbs>
          <Sheet>
            <List>
              {props.chores.map((chore) => {
                return (
                  <div key={`chore-${chore.id}`}>
                    <ListItem>
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
                        <div css={choreElement}>
                          {chore.weight === 2 ? (
                            <CircleIcon color="success" />
                          ) : chore.weight === 4 ? (
                            <CircleIcon css={mediumLoadIcon} />
                          ) : (
                            <CircleIcon color="error" />
                          )}
                          <Checkbox
                            css={checkboxStyles}
                            onChange={handleToggle(chore.id)}
                            checked={projectChore.indexOf(chore.id) !== -1}
                            {...label}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                          />
                        </div>
                      </ListItemContent>

                      {/* <div>Created by:{chore.creator_id}</div> */}
                    </ListItem>
                    <ListDivider />
                  </div>
                );
              })}
            </List>
          </Sheet>
          <div css={buttonContainer}>
            <Button
              css={buttonStyles}
              onClick={() => {
                createChoreHandler().catch((e) => {
                  console.log('request failed', e);
                });
              }}
            >
              Add Chores
            </Button>
          </div>
        </main>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionToken = context.req.cookies.sessionToken;
  const sessionId = await getValidSessionByToken(sessionToken);

  if (!sessionId) {
    return {
      props: { errors: ['You must be logged in to view this page'] },
    };
  }

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
