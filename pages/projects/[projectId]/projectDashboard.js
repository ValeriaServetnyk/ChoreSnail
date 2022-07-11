import { css } from '@emotion/react';
import CircleIcon from '@mui/icons-material/Circle';
import AspectRatio from '@mui/joy/AspectRatio';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Card, CardContent, Chip, Container, Stack } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  getChoresByProjectId,
  getParticipantsByProjectId,
} from '../../../util/database';

const choreTitleStyles = css`
  font-family: Nunito;
  font-size: 15px;
`;

const choreCardContainer = css`
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
  flex-direction: row;
  gap: 100px;
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
export default function ProjectDasboard(props) {
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    if (props.projectChores.length === 0) {
      return;
    }
    const totalSum = props.projectChores.reduce((sum, chore) => {
      sum = sum + chore.choreWeight;
      return sum;
    }, 0);

    setTotalWeight(totalSum);
  }, [totalWeight]);

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
                      onClick={() => {}}
                    />
                  </Stack>
                );
              })}
            </CardContent>

            <Sheet
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: 250,
                borderRadius: 'sm',
              }}
            >
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
                            <div>
                              {chore.choreWeight === 2 ? (
                                <CircleIcon color="success" />
                              ) : chore.choreWeight === 4 ? (
                                <CircleIcon css={mediumLoadIcon} />
                              ) : (
                                <CircleIcon color="error" />
                              )}
                            </div>
                          </ListItemContent>

                          {/* <div>Created by:{chore.creator_id}</div> */}
                        </ListItemButton>
                      </ListItem>
                      <ListDivider inset="gutter" />
                    </div>
                  );
                })}
              </List>
              <span css={totalContainer}>
                Total project load
                {totalWeight <= 20 ? (
                  <div>😁</div>
                ) : totalWeight <= 40 ? (
                  <div>🙄</div>
                ) : totalWeight <= 60 ? (
                  <div>🤨</div>
                ) : (
                  <div>🥵</div>
                )}
              </span>
            </Sheet>
          </div>
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const projectChores = await getChoresByProjectId(context.query.projectId);

  const participants = await getParticipantsByProjectId(
    context.query.projectId,
  );

  return {
    props: {
      projectChores,
      participants,
    },
  };
}
