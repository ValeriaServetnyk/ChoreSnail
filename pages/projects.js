import { css } from '@emotion/react';
import {
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { getUserByValidSessionToken } from '../util/database';

const titleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 40px;
  font-weight: medium;
  margin-top: 80px;
  margin-bottom: 10px;
`;

const buttonStyles = css`
  background-color: rgba(156, 85, 20, 1);
  border: none;

  margin-top: 30px;
  margin-bottom: 30px;

  color: white;

  a {
    font-family: Nunito;
  }
  &:hover {
    background-color: rgba(156, 85, 20, 0.8);
  }
`;

const continueButton = css`
  text-align: right;
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

const emptyButtonStyles = css`
  border-color: rgba(156, 85, 20, 1);
  margin-top: 30px;
  color: rgba(156, 85, 20, 1);

  &:hover {
    background-color: rgba(156, 85, 20, 0.3);
    border-color: rgba(156, 85, 20, 1);
  }
`;

const deleteButton = css`
  margin-top: 30px;
  color: rgba(156, 85, 20, 1);
  border-radius: 80%;

  &:hover {
    background-color: rgba(156, 85, 20, 0.3);
  }
`;

const errorMessageStyles = css`
  font-family: Nunito;
  color: rgba(226, 41, 41, 0.5);
`;
// frontend for API participants

export default function AddProject(props) {
  const [projectsList, setProjectsList] = useState([]);

  // set the list to inactive and once the button edit clicked turn the id of the line into active
  const [activeId, setActiveId] = useState(undefined);

  // user input, add project name

  const [newProjectName, setNewProjectName] = useState('');

  // user input, edit project name

  const [editProjectName, setEditProjectName] = useState('');

  const [errors, setErrors] = useState([]);

  // const router = useRouter();

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

  // add project to the api on button click

  async function createProjectsHandler() {
    const response = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: newProjectName,
        creatorId: props.user.id,
      }),
    });

    const createdProject = await response.json();

    if ('errors' in response) {
      setErrors(response.errors);
      return;
    }
    const newState = [...projectsList, createdProject];
    setProjectsList(newState);
    setNewProjectName('');
    // await router.push(`/participants`);
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
        method: 'PUT',
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
      <Container>
        <main css={pageLayout}>
          <h1 css={titleStyles}>Add project name</h1>
          <div>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                href="users/private-profile"
              >
                Dashboard
              </Link>
              <Typography color="text.primary">Projects</Typography>
            </Breadcrumbs>
          </div>
          <Card sx={{ minWidth: 275 }} css={cardElements}>
            <CardContent>
              <TextField
                margin="normal"
                required
                fullWidth
                id="projectname"
                label="Project name"
                name="Project name"
                value={newProjectName}
                onChange={(event) =>
                  setNewProjectName(event.currentTarget.value)
                }
              />
              <CardActions>
                <Button
                  onClick={() => {
                    createProjectsHandler().catch(() => {
                      console.log('request failed');
                    });
                  }}
                  css={buttonStyles}
                >
                  Start a project
                </Button>
                <div css={errorMessageStyles}>
                  {errors.map((error) => (
                    <span key={`error-${error.message}`}>{error.message}</span>
                  ))}
                </div>
              </CardActions>
              {projectsList.map((project) => {
                // do if is active
                return project.id === activeId ? (
                  <Fragment key={project.id}>
                    <TextField
                      fullWidth
                      id="standard-basic"
                      label="Edit project name"
                      variant="standard"
                      value={editProjectName}
                      onChange={(event) =>
                        setEditProjectName(event.currentTarget.value)
                      }
                    />

                    <Button
                      css={emptyButtonStyles}
                      onClick={() => {
                        setActiveId(undefined);
                        updateProjectHandler(project.id).catch(() => {
                          console.log('request failed');
                        });
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      css={deleteButton}
                      onClick={() =>
                        deleteProjectHandler(project.id).catch(() => {
                          console.log('request failed');
                        })
                      }
                    >
                      {' '}
                      x
                    </Button>
                  </Fragment>
                ) : (
                  // do if is inactive
                  <Fragment key={project.id}>
                    <TextField
                      fullWidth
                      id="filled-basic"
                      label="Project saved"
                      variant="filled"
                      value={project.projectName}
                      disabled
                    />

                    <Button
                      css={emptyButtonStyles}
                      onClick={() => {
                        setActiveId(project.id);
                        setEditProjectName(project.projectName);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      css={deleteButton}
                      onClick={() =>
                        deleteProjectHandler(project.id).catch(() => {
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
          <div css={continueButton}>
            <Button href="/participants" css={buttonStyles}>
              <a>Continue</a>
            </Button>
          </div>
        </main>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  // console.log('other user', user);
  if (!user) {
    return {
      props: {},
    };
  }
  return {
    props: {
      user: user || null,
    },
  };
}

// export default function AddProject(props) {
//   const [projectsList, setProjectsList] = useState([]);

//   // set the list to inactive and once the button edit clicked turn the id of the line into active
//   const [activeId, setActiveId] = useState(undefined);

//   // user input, add project name

//   const [newProjectName, setNewProjectName] = useState('');

//   // user input, edit project name

//   const [editProjectName, setEditProjectName] = useState('');

//   useEffect(() => {
//     async function getProjects() {
//       const response = await fetch('http://localhost:3000/api/projects');
//       const projects = await response.json();
//       setProjectsList(projects);
//     }
//     getProjects().catch(() => {
//       console.log('request failed');
//     });
//   }, []);

//   // add project to the api on button click

//   // console.log('new check', props.user);

//   async function createProjectsHandler() {
//     const response = await fetch('http://localhost:3000/api/projects', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         projectName: newProjectName,
//         creatorId: props.user.id,
//       }),
//     });

//     const createdProject = await response.json();
//     const newState = [...projectsList, createdProject];
//     setProjectsList(newState);
//     setNewProjectName('');
//   }

//   async function deleteProjectHandler(projectId) {
//     const response = await fetch(
//       `http://localhost:3000/api/projects/${projectId}`,
//       {
//         method: 'DELETE',
//         // headers: {
//         //   'Content-Type': 'application/json',
//         // },
//         // body: JSON.stringify({ }),
//       },
//     );
//     const deletedProject = await response.json();
//     const newState = projectsList.filter(
//       (project) => project.id !== deletedProject.id,
//     );
//     setProjectsList(newState);
//   }

//   async function updateProjectHandler(projectId) {
//     const response = await fetch(
//       `http://localhost:3000/api/projects/${projectId}`,
//       {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           projectName: editProjectName,
//         }),
//       },
//     );

//     const updatedProject = await response.json();
//     const newState = projectsList.map((project) => {
//       if (project.id === updatedProject.id) {
//         return updatedProject;
//       } else {
//         return project;
//       }
//     });
//     setProjectsList(newState);
//   }

//   return (
//     <div>
//       <Head>
//         <title>Add projects</title>

//         <meta name="add project" content="type in the name of your project" />
//       </Head>
//       <main>
//         <h1>Add project name</h1>
//         <div>
//           <Breadcrumbs aria-label="breadcrumb">
//             <Link
//               underline="hover"
//               color="inherit"
//               href="users/private-profile"
//             >
//               Dashboard
//             </Link>
//             <Typography color="text.primary">Projects</Typography>
//           </Breadcrumbs>
//         </div>
//         <label>
//           Project name:{' '}
//           <input
//             value={newProjectName}
//             onChange={(event) => setNewProjectName(event.currentTarget.value)}
//           />
//         </label>

//         <button
//           onClick={() => {
//             createProjectsHandler().catch(() => {
//               console.log('request failed');
//             });
//           }}
//         >
//           Start a project
//         </button>
//         <hr />

//         {projectsList

//           .map((project) => {
//             // do if is active
//             return project.id === activeId ? (
//               <Fragment key={project.id}>
//                 <label>
//                   Project name:{' '}
//                   <input
//                     value={editProjectName}
//                     onChange={(event) =>
//                       setEditProjectName(event.currentTarget.value)
//                     }
//                   />
//                 </label>

//                 <button
//                   onClick={() => {
//                     setActiveId(undefined);
//                     updateProjectHandler(project.id).catch(() => {
//                       console.log('request failed');
//                     });
//                   }}
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={() =>
//                     deleteProjectHandler(project.id).catch(() => {
//                       console.log('request failed');
//                     })
//                   }
//                 >
//                   X
//                 </button>
//               </Fragment>
//             ) : (
//               // do if is inactive
//               <Fragment key={project.id}>
//                 <label>
//                   Project name: <input value={project.projectName} disabled />
//                 </label>

//                 <button
//                   onClick={() => {
//                     setActiveId(project.id);
//                     setEditProjectName(project.projectName);
//                   }}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() =>
//                     deleteProjectHandler(project.id).catch(() => {
//                       console.log('request failed');
//                     })
//                   }
//                 >
//                   X
//                 </button>
//               </Fragment>
//             );
//           })}
//         <div>
//           <button href="/participants">
//             <a>Continue</a>
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export async function getServerSideProps(context) {
//   const user = await getUserByValidSessionToken(
//     context.req.cookies.sessionToken,
//   );
//   // console.log('other user', user);
//   if (!user) {
//     return {
//       props: {},
//     };
//   }
//   return {
//     props: {
//       user: user || null,
//     },
//   };
// }
