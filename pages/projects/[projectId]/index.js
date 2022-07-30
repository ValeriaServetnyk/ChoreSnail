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
import { createCsrfToken } from '../../../util/auth';
import {
  getParticipantsByProjectId,
  getProjectById,
  getUserByValidSessionToken,
  getValidSessionByToken,
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

  color: rgba(156, 85, 20, 1);
  font-family: Nunito;

  &:hover {
    background-color: rgba(156, 85, 20, 0.3);
    border-color: rgba(156, 85, 20, 1);
  }
`;

const cardElements = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(229, 208, 153, 0.38);
  margin-top: 30px;
`;

const pageLayout = css`
  min-height: 80vh;
`;

const deleteButton = css`
  color: rgba(156, 85, 20, 1);
  border-radius: 80%;

  &:hover {
    background-color: rgba(156, 85, 20, 0.3);
  }
`;

const breadcrumbsStyles = css`
  font-family: Nunito;
`;

const textInput = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
`;

const userInputButton = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
`;

const errorMessageStyles = css`
  font-family: Nunito;
  color: rgba(226, 41, 41, 0.5);
`;

const errorContainer = css`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const participantsListStyles = css`
  display: flex;
  flex-direction: column;
`;

const placeholderStyles = css`
  color: rgba(115, 115, 115, 0.7);
`;

const buttonContainer = css`
  text-align: right;
`;

// export type Participant = {
//   id: number;
//   projectId: number;
//   participantEmail: string;
//   participantName: string;
// };

// type Props = {
//   participants: Participant;
//   project: Project;
//   csrfToken: string;
//   errors: string[];
// };

// type Project = {
//   id: number;
//   projectName: string;
//   creatorId: number;
// };

export default function Participants(props) {
  const [participantsList, setParticipantsList] = useState([]);

  // set the list to inactive and once the button edit clicked turn the id of the line into active
  const [activeId, setActiveId] = useState(undefined);

  // user input, add participant

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // user input, edit participant

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setParticipantsList(props.participants);
  }, [props.participants]);

  async function createParticipantHandler() {
    const response = await fetch(
      `/api/projects/${props.project.id}/participants`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantName: newName,
          participantEmail: newEmail,
          projectId: props.project.id,
          csrfToken: props.csrfToken,
        }),
      },
    );

    const createdParticipant = await response.json();

    if ('errors' in createdParticipant) {
      setErrors(createdParticipant.errors);
      return;
    }

    const newState = [...participantsList, createdParticipant];
    setParticipantsList(newState);
    setNewName('');
    setNewEmail('');
  }

  async function deleteParticipantHandler(id, projectId) {
    const response = await fetch(
      `/api/projects/${projectId}/participants/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csrfToken: props.csrfToken,
        }),
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
      `/api/projects/${projectId}/participants/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantName: editName,
          participantEmail: editEmail,
          csrfToken: props.csrfToken,
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
  if (props.errors) {
    return <h1>{props.errors}</h1>;
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
              href="/users/private-profile"
            >
              Dashboard
            </Link>
            <Typography css={breadcrumbsStyles} color="text.primary">
              Add Participants
            </Typography>
          </Breadcrumbs>
          <div>
            <div css={textInput}>
              <TextField
                margin="normal"
                required
                id="participant name"
                color="secondary"
                label="Participant name"
                name="Participant name"
                value={newName}
                onChange={(event) => setNewName(event.currentTarget.value)}
              />
              <TextField
                margin="normal"
                required
                id="participant email"
                color="secondary"
                label="Participant email"
                name="Participant email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.currentTarget.value)}
              />
            </div>
            <div css={errorContainer}>
              <div css={userInputButton}>
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
              </div>
              <div css={errorMessageStyles}>
                {errors.map((error) => (
                  <span key={`error-${error.message}`}>{error.message}</span>
                ))}
              </div>
            </div>
          </div>
          <hr />
          <Card sx={{ minWidth: 275 }} css={cardElements}>
            {participantsList.length === 0 ? (
              <h3 css={placeholderStyles}>Participants will appear here</h3>
            ) : (
              <CardContent>
                {participantsList
                  .sort((a, b) => a.id - b.id)
                  .map((participant) => {
                    // do if is active
                    return participant.id === activeId ? (
                      <Fragment key={participant.id}>
                        <div css={participantsListStyles}>
                          <div>
                            <TextField
                              id="standard-basic"
                              label="Edit participant name"
                              variant="standard"
                              value={editName}
                              onChange={(event) =>
                                setEditName(event.currentTarget.value)
                              }
                            />{' '}
                            <TextField
                              id="standard-basic"
                              label="Edit participant email"
                              color="secondary"
                              variant="standard"
                              value={editEmail}
                              onChange={(event) =>
                                setEditEmail(event.currentTarget.value)
                              }
                            />
                          </div>
                          <div>
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
                          </div>
                        </div>
                      </Fragment>
                    ) : (
                      // do if is inactive
                      <Fragment key={participant.id}>
                        <div css={participantsListStyles}>
                          <div>
                            <TextField
                              value={participant.participantName}
                              color="secondary"
                              id="filled-basic"
                              label="Participant name saved"
                              variant="filled"
                              disabled
                            />{' '}
                            <TextField
                              id="filled-basic"
                              color="secondary"
                              label="Participant email saved"
                              variant="filled"
                              value={participant.participantEmail}
                              disabled
                            />
                          </div>
                          <div>
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
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
              </CardContent>
            )}
          </Card>
          <div css={buttonContainer}>
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
  if (!isOwner) {
    // return error message in props
    return {
      props: {
        errors: ['You are not the owner of this project'],
      },
    };
  }

  // if yes then show project and participants otherwise redirect to login page
  const project = await getProjectById(context.query.projectId);
  const participants = await getParticipantsByProjectId(
    context.query.projectId,
  );
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    return {
      props: { errors: ['You must be logged in to view this page'] },
    };
  }
  const csrfToken = await createCsrfToken(session.csrfSecret);

  return {
    props: {
      project,
      participants,
      csrfToken: csrfToken,
    },
  };
}
