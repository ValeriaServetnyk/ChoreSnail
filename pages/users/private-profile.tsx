import { css } from '@emotion/react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { createCsrfToken } from '../../util/auth';
import {
  getProjectsByValidSessionToken,
  getUserByValidSessionToken,
  getValidSessionByToken,
} from '../../util/database';

const titleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 40px;
  font-weight: medium;
  margin-top: 80px;
  margin-bottom: 10px;
  font-family: Nunito;
`;

const popupTitleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 40px;
  font-weight: medium;
  background-color: rgba(229, 208, 153, 0.38);
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

  color: rgba(156, 85, 20, 1);
  font-family: Nunito;

  &:hover {
    background-color: rgba(156, 85, 20, 0.3);
    border-color: rgba(156, 85, 20, 1);
  }
`;

const deleteButton = css`
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

const errorContainer = css`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const dialogBox = css`
  background-color: rgba(229, 208, 153, 0.38);
`;

const dialogActions = css`
  background-color: rgba(229, 208, 153, 0.38);
`;

const placeholderStyles = css`
  color: rgba(115, 115, 115, 0.7);
`;

const secondHeader = css`
  margin-bottom: 30px;
  text-align: center;
`;
type Project = {
  id: number;
  projectName: string;
  creatorId: number;
};

type Props = {
  user: {
    id: number;
    username: string;
  };
  projects: Project[];
  csrfToken: string;
};

export default function UserDashboard(props: Props) {
  const [projectsList, setProjectsList] = useState<Project[]>(props.projects);

  // set the list to inactive and once the button edit clicked turn the id of the line into active
  const [activeId, setActiveId] = useState<Project['id'] | undefined>(
    undefined,
  );

  // user input, add project name

  const [newProjectName, setNewProjectName] = useState('');

  // user input, edit project name

  const [editProjectName, setEditProjectName] = useState('');

  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   async function getProjects() {
  //     const response = await fetch('/api/projects');

  //     const projects = await response.json();
  //     setProjectsList(projects);
  //   }
  //   getProjects().catch(() => {
  //     console.log('request failed');
  //   });
  // }, []);

  // add project to the api on button click

  async function createProjectsHandler() {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: newProjectName,
        creatorId: props.user.id,
        csrfToken: props.csrfToken,
      }),
    });

    const createdProject = await response.json();

    if ('errors' in createdProject) {
      setErrors(createdProject.errors);
      return;
    }
    const newState = [...projectsList, createdProject];
    setProjectsList(newState);
    setNewProjectName('');
    // console.log(createdProject);
    await router.push(`/projects/${createdProject.id}`);
  }

  async function deleteProjectHandler(id: number) {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        csrfToken: props.csrfToken,
      }),
    });
    const deletedProject = await response.json();
    const newState = projectsList.filter(
      (project) => project.id !== deletedProject.id,
    );
    setProjectsList(newState);
  }

  async function updateProjectHandler(id: number) {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: editProjectName,
        csrfToken: props.csrfToken,
      }),
    });

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
      <Container>
        <Head>
          <title>{props.user.username}</title>

          <meta name="user dashboard" content="user`s past activity log" />
        </Head>
        <main css={pageLayout}>
          <h1 css={titleStyles}>
            Welcome to your dashboard {props.user.username}
          </h1>

          <Button css={buttonStyles} onClick={handleClickOpen}>
            Create new project
          </Button>

          {/* open dialog box to initiate a new project */}

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle css={popupTitleStyles}>What is planned? </DialogTitle>
            <DialogContent css={dialogBox}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="projectname"
                label="Project name"
                color="secondary"
                name="Project name"
                value={newProjectName}
                onChange={(event) =>
                  setNewProjectName(event.currentTarget.value)
                }
              />
              <div css={errorContainer}>
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
              </div>
            </DialogContent>
            <DialogActions css={dialogActions}>
              <Button
                css={emptyButtonStyles}
                variant="outlined"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* dialog box closed */}
          <div css={secondHeader}>
            <h1>My past projects</h1>
          </div>
          <Card sx={{ minWidth: 275 }} css={cardElements}>
            {projectsList.length === 0 ? (
              <h3 css={placeholderStyles}>Your projects will appear here</h3>
            ) : (
              <CardContent>
                {projectsList.map((project) => {
                  // do if is active
                  return project.id === activeId ? (
                    <Fragment key={project.id}>
                      <TextField
                        fullWidth
                        color="secondary"
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
            )}
          </Card>
        </main>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    return {
      props: { errors: ['You must be logged in to view this page'] },
    };
  }
  const csrfToken = await createCsrfToken(session.csrfSecret);

  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    const projects = await getProjectsByValidSessionToken(
      context.req.cookies.sessionToken,
    );

    return {
      props: {
        user: user,
        projects: projects,
        csrfToken: csrfToken,
      },
    };
  }
  return {
    redirect: {
      destination: `/login?returnTo=/users/private-profile`,
      permanent: false,
    },
  };
}
