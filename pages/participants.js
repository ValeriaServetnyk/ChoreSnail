import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

// frontend for API participants

export default function AddParticipants() {
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
    async function getParticipants() {
      const response = await fetch('http://localhost:3000/api/participants');
      const participants = await response.json();
      setParticipantsList(participants);
    }
    getParticipants().catch(() => {
      console.log('request failed');
    });
  }, []);

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
        method: 'PUT  ',
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
        <h1>Pick project participants</h1>
        <div>
          <Link href="/">
            <a>Back</a>
          </Link>
          <Link href="/">
            <a>Continue</a>
          </Link>
        </div>
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

// export async function getServerSideProps() {
//   const chores = await getParticipants();
//   return {
//   props: {
//   participants: participants,
//   },
//   };
//   }
