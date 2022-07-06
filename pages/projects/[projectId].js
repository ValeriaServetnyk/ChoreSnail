import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import {
  getParticipantsByProjectId,
  getProjectById,
  getUserByValidSessionToken,
  isCreator,
} from '../../util/database';

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

  console.log('participantsList', participantsList);

  // add participants to the api on button click

  async function createParticipantHandler() {
    const response = await fetch('http://localhost:3000/api/participants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participantName: newName,
        participantEmail: newEmail,
        projectId: props.project.id,
      }),
    });

    const createdParticipant = await response.json();
    const newState = [...participantsList, createdParticipant];
    setParticipantsList(newState);
    setNewName('');
    setNewEmail('');
  }

  async function deleteParticipantHandler(id) {
    const response = await fetch(
      `http://localhost:3000/api/participants/${id}`,
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

  async function updateParticipantHandler(id) {
    const response = await fetch(
      `http://localhost:3000/api/participants/${id}`,
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
      <main>
        <h1>Pick participants for {props.project.projectName}</h1>
        <label>
          Participant name:{' '}
          <input
            value={newName}
            onChange={(event) => setNewName(event.currentTarget.value)}
          />
        </label>
        <label>
          Participant email:{' '}
          <input
            value={newEmail}
            onChange={(event) => setNewEmail(event.currentTarget.value)}
          />
        </label>
        <button
          onClick={() => {
            createParticipantHandler().catch(() => {
              console.log('request failed');
            });
          }}
        >
          Add participant
        </button>
        <hr />
        Participant to be created: {newName} {newEmail}
        {participantsList
          .sort((a, b) => a.id - b.id)
          .map((participant) => {
            // do if is active
            return participant.id === activeId ? (
              <Fragment key={participant.id}>
                <label>
                  Participant name:{' '}
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.currentTarget.value)}
                  />
                </label>
                <label>
                  Participant email:{' '}
                  <input
                    value={editEmail}
                    onChange={(event) =>
                      setEditEmail(event.currentTarget.value)
                    }
                  />
                </label>
                <button
                  onClick={() => {
                    setActiveId(undefined);
                    updateParticipantHandler(participant.id).catch(() => {
                      console.log('request failed');
                    });
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() =>
                    deleteParticipantHandler(participant.id).catch(() => {
                      console.log('request failed');
                    })
                  }
                >
                  X
                </button>
              </Fragment>
            ) : (
              // do if is inactive
              <Fragment key={participant.id}>
                <label>
                  Participant name:{' '}
                  <input value={participant.participantName} disabled />
                </label>
                <label>
                  Participant email:{' '}
                  <input value={participant.participantEmail} disabled />
                </label>
                <button
                  onClick={() => {
                    setActiveId(participant.id);
                    setEditName(participant.participantName);
                    setEditEmail(participant.participantEmail);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    deleteParticipantHandler(participant.id).catch(() => {
                      console.log('request failed');
                    })
                  }
                >
                  X
                </button>
              </Fragment>
            );
          })}
        <div>
          <button>Continue</button>
        </div>
      </main>
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
