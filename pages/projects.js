import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { getUserByValidSessionToken } from '../util/database';

// frontend for API participants

export default function AddProject() {
  const [projectsList, setProjectsList] = useState([]);

  // set the list to inactive and once the button edit clicked turn the id of the line into active
  const [activeId, setActiveId] = useState(undefined);

  // user input, add participant

  const [newProjectName, setNewProjectName] = useState('');

  // user input, edit participant

  const [editProjectName, setEditProjectName] = useState('');

  useEffect(() => {
    async function getProjects() {
      const response = await fetch('http://localhost:3000/api/projects');
      const projects = await response.json();
      setProjectsList(projects);
    }
    getProjects().catch(() => {
      console.log('request failed');
    });
  }, []);

  // add participants to the api on button click

  async function createProjectsHandler() {
    const response = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: newProjectName,
      }),
    });

    const createdProject = await response.json();
    const newState = [...projectsList, createdProject];
    setProjectsList(newState);
    setNewProjectName('');
  }

  async function deleteProjectHandler(projectId) {
    const response = await fetch(
      `http://localhost:3000/api/projects/${projectId}`,
      {
        method: 'DELETE',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // body: JSON.stringify({ }),
      },
    );
    const deletedProject = await response.json();
    const newState = projectsList.filter(
      (project) => project.id !== deletedProject.id,
    );
    setProjectsList(newState);
  }

  async function updateProjectHandler(projectId) {
    const response = await fetch(
      `http://localhost:3000/api/projects/${projectId}`,
      {
        method: 'PUT  ',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: editProjectName,
        }),
      },
    );

    const updatedProject = await response.json();
    const newState = projectsList.map((project) => {
      if (project.id === updatedProject.id) {
        return updatedProject;
      } else {
        return project;
      }
    });
    setProjectsList(newState);
  }

  return (
    <div>
      <Head>
        <title>Add projects</title>

        <meta name="add project" content="type in the name of your project" />
      </Head>
      <main>
        <h1>Add project name</h1>
        <div>
          <Link href="/">
            <a>Back</a>
          </Link>
        </div>
        <label>
          Project name:{' '}
          <input
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.currentTarget.value)}
          />
        </label>

        <button
          onClick={() => {
            createProjectsHandler().catch(() => {
              console.log('request failed');
            });
          }}
        >
          Start a project
        </button>
        <hr />

        {projectsList
          .sort((a, b) => a.id - b.id)
          .map((project) => {
            // do if is active
            return project.id === activeId ? (
              <Fragment key={project.id}>
                <label>
                  Project name:{' '}
                  <input
                    value={editProjectName}
                    onChange={(event) =>
                      setEditProjectName(event.currentTarget.value)
                    }
                  />
                </label>

                <button
                  onClick={() => {
                    setActiveId(undefined);
                    updateProjectHandler(project.id).catch(() => {
                      console.log('request failed');
                    });
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() =>
                    deleteProjectHandler(project.id).catch(() => {
                      console.log('request failed');
                    })
                  }
                >
                  X
                </button>
              </Fragment>
            ) : (
              // do if is inactive
              <Fragment key={project.id}>
                <label>
                  Project name: <input value={project.projectName} disabled />
                </label>

                <button
                  onClick={() => {
                    setActiveId(project.id);
                    setEditProjectName(project.projectName);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    deleteProjectHandler(project.id).catch(() => {
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
          <button>
            <Link href="/participants">
              <a>Continue</a>
            </Link>
          </button>
        </div>
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
      props: {},
    };
  }
  return {
    redirect: {
      destination: `/login?returnTo=/projects`,
      permanent: false,
    },
  };
}
// export async function getServerSideProps() {
//   const chores = await getParticipants();
//   return {
//   props: {
//   participants: participants,
//   },
//   };
//   }
