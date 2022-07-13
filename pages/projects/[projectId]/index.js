import { css } from '@emotion/react';
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import {
  getParticipantsByProjectId,
  getProjectById,
  getUserByValidSessionToken,
  isCreator,
} from '../../../util/database';

const titleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 40px;
  font-weight: medium;
  margin-top: 80px;
  margin-bottom: 40px;
  font-family: Nunito;
`;

const buttonStyles = css`
  background-color: rgba(156, 85, 20, 1);
  border: none;

  margin-top: 30px;
  margin-bottom: 30px;
  color: white;
  font-family: Nunito;

  &:hover {
    background-color: rgba(156, 85, 20, 0.8);
  }
`;

const emptyButtonStyles = css`
  border-color: rgba(156, 85, 20, 1);
  margin-top: 30px;
  color: rgba(156, 85, 20, 1);
  font-family: Nunito;

  &:hover {
    background-color: rgba(156, 85, 20, 0.3);
    border-color: rgba(156, 85, 20, 1);
  }
`;

const cardElements = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(229, 208, 153, 0.38);
  margin-top: 30px;
`;

const pageLayout = css`
  min-height: 80vh;
`;

const deleteButton = css`
  margin-top: 30px;
  color: rgba(156, 85, 20, 1);
  border-radius: 80%;

  &:hover {
    background-color: rgba(156, 85, 20, 0.3);
  }
`;

const breadcrumbsStyles = css`
  font-family: Nunito;
`;

export default function Project(props) {
  const [participantsList, setParticipantsList] = useState([]);

  // set the list to inactive and once the button edit clicked turn the id of the line into active
  const [activeId, setActiveId] = useState(undefined);

  // user input, add participant

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // user input, edit participant

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    setParticipantsList(props.participants);
  }, [props.participants]);
  // console.log('participantsList', participantsList);

  // add participants to the api on button click

  async function createParticipantHandler() {
    const response = await fetch(
      `http://localhost:3000/api/projects/${props.project.id}/participants`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantName: newName,
          participantEmail: newEmail,
          projectId: props.project.id,
        }),
      },
    );

    const createdParticipant = await response.json();
    const newState = [...participantsList, createdParticipant];
    setParticipantsList(newState);
    setNewName('');
    setNewEmail('');
  }

  async function deleteParticipantHandler(id, projectId) {
    const response = await fetch(
      `http://localhost:3000/api/projects/${projectId}/participants/${id}`,
      {
        method: 'DELETE',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // body: JSON.stringify({ }),
      },
    );
    const deletedParticipant = await response.json();
    const newState = participantsList.filter(
      (participant) => participant.id !== deletedParticipant.id,
    );
    setParticipantsList(newState);
  }

  async function updateParticipantHandler(id, projectId) {
    const response = await fetch(
      `http://localhost:3000/api/projects/${projectId}/participants/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantName: editName,
          participantEmail: editEmail,
        }),
      },
    );

    const updatedParticipant = await response.json();
    const newState = participantsList.map((participant) => {
      if (participant.id === updatedParticipant.id) {
        return updatedParticipant;
      } else {
        return participant;
      }
    });
    setParticipantsList(newState);
  }
  // if there is an error in the props, return a h1 element with the error message
  if (props.error) {
    return <h1>{props.error}</h1>;
  }
  if (!props.project) {
    return (
      <div>
        <h1>You have no projects</h1>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Add participants</title>

        <meta
          name="add participants"
          content="type in the name and the email of the participants for your project"
        />
      </Head>
      <Container>
        <main css={pageLayout}>
          <h1 css={titleStyles}>
            Pick participants for {props.project.projectName}
          </h1>
          <Breadcrumbs aria-label="breadcrumb" css={breadcrumbsStyles}>
            <Link
              underline="hover"
              color="inherit"
              href="http://localhost:3000/users/private-profile"
            >
              Dashboard
            </Link>
            <Typography css={breadcrumbsStyles} color="text.primary">
              Add Participants
            </Typography>
          </Breadcrumbs>
          <TextField
            margin="normal"
            required
            fullWidth
            id="participant name"
            label="Participant name"
            name="Participant name"
            value={newName}
            onChange={(event) => setNewName(event.currentTarget.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="participant email"
            label="Participant email"
            name="Participant email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.currentTarget.value)}
          />
          <Button
            css={buttonStyles}
            onClick={() => {
              createParticipantHandler().catch(() => {
                console.log('request failed');
              });
            }}
          >
            Add participant
          </Button>
          <hr />
          <Card sx={{ minWidth: 275 }} css={cardElements}>
            <CardContent>
              {participantsList
                .sort((a, b) => a.id - b.id)
                .map((participant) => {
                  // do if is active
                  return participant.id === activeId ? (
                    <Fragment key={participant.id}>
                      <TextField
                        fullWidth
                        id="standard-basic"
                        label="Edit participant name"
                        variant="standard"
                        value={editName}
                        onChange={(event) =>
                          setEditName(event.currentTarget.value)
                        }
                      />

                      <TextField
                        fullWidth
                        id="standard-basic"
                        label="Edit participant email"
                        variant="standard"
                        value={editEmail}
                        onChange={(event) =>
                          setEditEmail(event.currentTarget.value)
                        }
                      />

                      <Button
                        css={emptyButtonStyles}
                        onClick={() => {
                          setActiveId(undefined);
                          updateParticipantHandler(
                            participant.id,
                            props.project.id,
                          ).catch(() => {
                            console.log('request failed');
                          });
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        css={deleteButton}
                        onClick={() =>
                          deleteParticipantHandler(
                            participant.id,
                            props.project.id,
                          ).catch(() => {
                            console.log('request failed');
                          })
                        }
                      >
                        x
                      </Button>
                    </Fragment>
                  ) : (
                    // do if is inactive
                    <Fragment key={participant.id}>
                      <TextField
                        value={participant.participantName}
                        fullWidth
                        id="filled-basic"
                        label="Participant name saved"
                        variant="filled"
                        disabled
                      />

                      <TextField
                        id="filled-basic"
                        label="Participant email saved"
                        variant="filled"
                        value={participant.participantEmail}
                        disabled
                      />

                      <Button
                        css={emptyButtonStyles}
                        onClick={() => {
                          setActiveId(participant.id);
                          setEditName(participant.participantName);
                          setEditEmail(participant.participantEmail);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        css={deleteButton}
                        onClick={() =>
                          deleteParticipantHandler(
                            participant.id,
                            props.project.id,
                          ).catch(() => {
                            console.log('request failed');
                          })
                        }
                      >
                        x
                      </Button>
                    </Fragment>
                  );
                })}
            </CardContent>
          </Card>
          <div>
            <Button
              href={`/projects/${props.project.id}/chores`}
              css={buttonStyles}
            >
              Continue
            </Button>
          </div>
        </main>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Get the user id from token
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  // console.log('other user', user);
  if (!user) {
    return {
      redirect: {
        destination: `/login?returnTo=/projects/${context.query.projectId}`,
        permanent: false,
      },
    };
  }

  // create a function that takes project id and user id and checks if user is owner of the project

  const isOwner = await isCreator(user.id, context.query.projectId);
  // console.log('isOwner', isOwner);
  if (!isOwner) {
    // return error message in props
    return {
      props: {
        error: 'You are not the owner of this project',
      },
    };
  }

  // if yes then show project and participants otherwise redirect to login page
  const project = await getProjectById(context.query.projectId);
  const participants = await getParticipantsByProjectId(
    context.query.projectId,
  );

  return {
    props: {
      project,
      participants,
    },
  };
}
