import { css } from '@emotion/react';
import CircleIcon from '@mui/icons-material/Circle';
import AspectRatio from '@mui/joy/AspectRatio';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import {
  Button,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  getChoresByProjectId,
  getParticipantsByProjectId,
  getProjectById,
} from '../../../util/database';

const choreTitleStyles = css`
  font-family: Nunito;
  font-size: 15px;
`;

const choreCardContainer = css`
  text-align: right;
`;

// const cardElements = css`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: rgba(229, 208, 153, 0.38);
//   margin-top: 30px;
// `;

const pageLayout = css`
  min-height: 100vh;
`;

const mediumLoadIcon = css`
  color: #fff200;
`;

const titleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 40px;
  font-weight: medium;
  margin-top: 80px;
  margin-bottom: 60px;
  font-family: Nunito;
`;

const dashboardContainer = css`
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin: 0px;
  padding: 0px;
  align-items: center;
  justify-content: center;
`;

const participantsList = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const totalContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
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

const buttonContainer = css`
  margin-top: 30px;
  text-align: center;
`;

const checkboxStyles = css`
  color: rgba(156, 85, 20, 1);

  .checked {
    color: rgba(156, 85, 20, 1);
  }
`;

const dialogBox = css`
  background-color: rgba(229, 208, 153, 0.38);
`;

const dialogActions = css`
  background-color: rgba(229, 208, 153, 0.38);
`;

const popupTitleStyles = css`
  color: rgba(156, 85, 20, 1);
  font-size: 20px;
  font-weight: medium;
  background-color: rgba(229, 208, 153, 0.38);
  font-family: Nunito;
`;

const choreElement = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function ProjectDasboard(props) {
  const [totalWeight, setTotalWeight] = useState(0);
  const [projectParticipantChore, setProjectParticipantChore] = useState([]);
  const [newChoresList, setNewChoresList] = useState([]);

  // checkbox variable
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const [activeParticipantId, setActiveParticipantId] = useState(false);

  const handleClickOpen = (id) => {
    setActiveParticipantId(id);
  };

  const handleClose = () => {
    setActiveParticipantId(false);
  };

  useEffect(() => {
    if (projectParticipantChore.length === 0) {
      return;
    }
    const totalSum = projectParticipantChore.reduce((sum, chore) => {
      sum = sum + chore.choreWeight;
      return sum;
    }, 0);

    setTotalWeight(totalSum);
  }, [totalWeight]);

  const handleToggle = (id) => () => {
    const currentIndex = projectParticipantChore.indexOf(id);
    const newChecked = [...projectParticipantChore];
    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setProjectParticipantChore(newChecked);
    console.log(newChecked);
  };

  async function assignChoresHandler(id) {
    const response = await fetch(
      `/api/projects/${props.project.id}/participants/${id}/chore`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: props.project.id,
          participantId: id,
          choreIds: projectParticipantChore,
        }),
      },
    );

    setProjectParticipantChore([]);
    setActiveParticipantId(false);
    // await router.push(`/projects/${createdProject.id}`);
  }

  async function sendEmailHandler() {
    console.log('send email');
    for (const participant of props.participants) {
      const chores_list = await fetch(
        `/api/projects/${props.project.id}/participants/${participant.id}/chore`,
      );
      const data = {
        name: participant.participantName,
        email: participant.participantEmail,
        message: await chores_list.json(),
      };
      // send email to the participant using gmail route
      const choreNameList = [];
      for (const chore of data.message) {
        choreNameList.push(chore.choreName);
      }
      data.message = choreNameList.join(', ');
      const res = await fetch('/api/gmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }
  }

  return (
    <div>
      <Head>
        <title>Projects Dashboard</title>

        <meta
          name="project summary"
          content="project page including participants and chores"
        />
      </Head>

      <main css={pageLayout}>
        <Container>
          <h1 css={titleStyles}> Project summary</h1>

          <div css={dashboardContainer}>
            <CardContent css={participantsList}>
              {props.participants.map((participant) => {
                return (
                  <Stack key={participant.id}>
                    <Chip
                      label={`Pick chores for ${participant.participantName}`}
                      onClick={() => handleClickOpen(participant.id)}
                    />
                  </Stack>
                );
              })}
            </CardContent>

            <Dialog open={activeParticipantId} onClose={handleClose}>
              <DialogTitle css={popupTitleStyles}>
                Pick chores for this participant
              </DialogTitle>
              <DialogContent css={dialogBox}>
                <List sx={{ py: 'var(--List-divider-gap)' }}>
                  {props.projectChores.map((chore) => {
                    return (
                      <div key={`chore-${chore.choreId}`}>
                        <ListItem>
                          <ListItemButton sx={{ gap: 2 }}>
                            <AspectRatio
                              sx={{
                                flexBasis: 120,
                                borderRadius: 'sm',
                                overflow: 'auto',
                              }}
                            >
                              <Image
                                src={`/${chore.choreIconName}.png`}
                                width="60"
                                height="60"
                                alt="chore icons"
                              />
                            </AspectRatio>
                            <ListItemContent css={choreCardContainer}>
                              <Typography css={choreTitleStyles}>
                                {chore.choreName}
                              </Typography>
                              <div css={choreElement}>
                                {chore.choreWeight === 2 ? (
                                  <CircleIcon color="success" />
                                ) : chore.choreWeight === 4 ? (
                                  <CircleIcon css={mediumLoadIcon} />
                                ) : (
                                  <CircleIcon color="error" />
                                )}
                                <Checkbox
                                  css={checkboxStyles}
                                  onChange={handleToggle(chore.choreId)}
                                  checked={
                                    projectParticipantChore.indexOf(
                                      chore.choreId,
                                    ) !== -1
                                  }
                                  {...label}
                                  sx={{
                                    '& .MuiSvgIcon-root': { fontSize: 28 },
                                  }}
                                />
                              </div>
                            </ListItemContent>
                          </ListItemButton>
                        </ListItem>
                        <ListDivider inset="gutter" />
                      </div>
                    );
                  })}
                </List>
                <span css={totalContainer}>
                  Total project load
                  {totalWeight <= 10 ? (
                    <div>😁</div>
                  ) : totalWeight <= 20 ? (
                    <div>🙄</div>
                  ) : totalWeight <= 30 ? (
                    <div>🤨</div>
                  ) : (
                    <div>🥵</div>
                  )}
                </span>
                <div>
                  <Button
                    onClick={() => {
                      assignChoresHandler(activeParticipantId).catch((e) => {
                        console.log('request failed', e);
                      });
                    }}
                    css={buttonStyles}
                  >
                    Add chores
                  </Button>
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
          </div>
          <div css={buttonContainer}>
            <Button css={buttonStyles} onClick={sendEmailHandler}>
              Share project
            </Button>
          </div>
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const projectChores = await getChoresByProjectId(context.query.projectId);
  const project = await getProjectById(context.query.projectId);
  const participants = await getParticipantsByProjectId(
    context.query.projectId,
  );

  return {
    props: {
      projectChores,
      participants,
      project,
    },
  };
}
