import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';

setPostgresDefaultsOnHeroku();

config();

// connect only once to database to prevent running out of slots

function connectOneTimeToDatabase() {
  let sql;
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }
  return sql;
}

const sql = connectOneTimeToDatabase();

export async function getChores() {
  const chores = await sql`
SELECT * from chores`;
  return camelcaseKeys(chores);
}

// to return participant by id
export async function getParticipantById(id) {
  const [participant] = await sql`
SELECT * from project_participants
WHERE id = ${id}`;
  return camelcaseKeys(participant);
}

export async function getParticipantsByProjectId(id) {
  const participants = await sql`
SELECT * from project_participants
WHERE project_id = ${id}`;
  return participants.map((participant) => camelcaseKeys(participant));
}

export async function getParticipantByProjectId(id) {
  const [participant] = await sql`
SELECT * from project_participants
WHERE project_id = ${id}`;
  return camelcaseKeys(participant);
}

// to delete participant by id
export async function deleteParticipantById(id) {
  const [participant] = await sql`
DELETE FROM project_participants
WHERE id=${id}
RETURNING *`;
  return camelcaseKeys(participant);
}

// to insert participant
export async function insertParticipant(
  participantName,
  participantEmail,
  projectId,
) {
  const [participant] = await sql`
INSERT INTO project_participants
(participant_name, participant_email, project_id)
VALUES (${participantName}, ${participantEmail}, ${projectId})
 RETURNING *`;
  return camelcaseKeys(participant);
}

// to update participant by id
export async function updateParticipantById(
  id,
  participantName,
  participantEmail,
) {
  const [participant] = await sql`
UPDATE project_participants
SET
participant_name= ${participantName},
participant_email=${participantEmail}
WHERE id=${id}
 RETURNING *`;
  return camelcaseKeys(participant);
}

// routes for project table

export async function getProjects() {
  const projects = await sql`
SELECT * from projects`;
  return projects.map((project) => camelcaseKeys(project));
}

export async function getProjectById(id) {
  const [project] = await sql`
SELECT * FROM projects
WHERE id = ${id}`;
  return camelcaseKeys(project);
}

export async function deleteProjectById(id) {
  const [project] = await sql`
DELETE FROM projects
WHERE id=${id}
RETURNING *`;
  return camelcaseKeys(project);
}

export async function insertProject(projectName, creatorId) {
  const [project] = await sql`
INSERT INTO projects
(project_name, creator_id)
VALUES (${projectName}, ${creatorId} )
 RETURNING *`;
  return camelcaseKeys(project);
}

export async function updateProjectById(id, projectName) {
  const [project] = await sql`
UPDATE projects
SET
project_name= ${projectName}
WHERE id=${id}
 RETURNING *`;
  return camelcaseKeys(project);
}

// backend for user registration

export async function createUser(username, passwordHash) {
  const [user] = await sql`
INSERT INTO users
(username, password_hash)
VALUES (${username}, ${passwordHash})
 RETURNING
 id,
 username`;
  return camelcaseKeys(user);
}

export async function getUserByUsername(username) {
  if (!username) return undefined;

  const [user] = await sql`
SELECT id, username
FROM users
WHERE username = ${username}`;
  return user && camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username) {
  if (!username) return undefined;

  const [user] = await sql`
SELECT *
FROM users
WHERE username = ${username}`;
  return user && camelcaseKeys(user);
}

export async function getUserById(userId) {
  if (!userId) return undefined;

  const [user] = await sql`
SELECT id, username
FROM users
WHERE id = ${userId}`;
  return user && camelcaseKeys(user);
}

export async function deleteSessionByToken(token) {
  const [session] = await sql`
  DELETE FROM sessions
  WHERE
 sessions.token = ${token}
 RETURNING *
 `;
  return session && camelcaseKeys(session);
}

export async function deleteExpiredSessions() {
  const sessions = await sql`
  DELETE FROM
    sessions
  WHERE
    expiry_timestamp < now()
  RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session));
}

export async function createSession(token, userId, CSRFSecret) {
  const [session] = await sql`
  INSERT INTO sessions
  (token, user_id, csrf_secret)
  VALUES (${token}, ${userId}, ${CSRFSecret})
   RETURNING
   id,
   token`;
  await deleteExpiredSessions();

  return camelcaseKeys(session);
}

export async function getValidSessionByToken(token) {
  if (!token) return undefined;

  const [session] = await sql`
  SELECT
    sessions.id,
    sessions.token,
    sessions.csrf_secret
  FROM
    sessions
  WHERE
    sessions.token = ${token} AND
    sessions.expiry_timestamp > now();
  `;

  await deleteExpiredSessions();

  return session && camelcaseKeys(session);
}

export async function getUserByValidSessionToken(token) {
  if (!token) return undefined;
  const [user] = await sql`
  SELECT
  users.id,
  users.username
  FROM
  users,
  sessions
  WHERE
 sessions.token = ${token} AND
 sessions.user_id = users.id AND
 sessions.expiry_timestamp > now();
  `;
  await deleteExpiredSessions();
  return user && camelcaseKeys(user);
}

export async function getProjectsByValidSessionToken(token) {
  if (!token) return undefined;
  const project = await sql`
  SELECT
   projects.id,
   projects.project_name as project_name
FROM
  projects,
  users,
  sessions
WHERE
 projects.creator_id = users.id
AND
 sessions.user_id = users.id
AND
 sessions.token = ${token}`;
  return project && camelcaseKeys(project);
}

// Create a function that checks if user is creator of project
export async function isCreator(userId, projectId) {
  const [project] = await sql`
  SELECT
   projects.id as project_id
FROM
  projects,
  users
WHERE
 projects.creator_id = users.id
AND
 users.id = ${userId}
AND
 projects.id = ${projectId}`;
  return project && camelcaseKeys(project);
}

// create a function that inserts list of chore ids into project_chores table
export async function insertChoresIntoProject(projectId, choreIds) {
  // loop over chore ids and create a list of lists containing projectId and a chore id for each chore
  const choreValues = [];
  for (let i = 0; i < choreIds.length; i++) {
    choreValues.push({ project_id: projectId, chore_id: choreIds[i] });
  }
  console.log(choreValues);

  const chores = await sql`
  INSERT INTO project_chores ${sql(choreValues, 'project_id', 'chore_id')}`;
  return chores.map((chore) => camelcaseKeys(chore));
}

// write a function that fetches all chores for a projectId
export async function getChoresByProjectId(projectId) {
  const chores = await sql`
  SELECT
   chores.id as chore_id,
   chores.name as chore_name,
   chores.weight as chore_weight,
   chores.icon_name as chore_icon_name

FROM
  chores,
  project_chores
WHERE
 project_chores.project_id = ${projectId}
AND
 project_chores.chore_id = chores.id`;
  return chores.map((chore) => camelcaseKeys(chore));
}

// write a function that sets assigned participant id on project_chores table of multiple chore ids
export async function setAssignedParticipantId(
  projectId,
  choreIds,
  participantId,
) {
  const chores =
    await sql`update project_chores set assigned_participant_id = ${participantId} where chore_id in ${sql(
      choreIds,
    )} and project_id = ${projectId}  RETURNING *`;

  return chores.map((chore) => camelcaseKeys(chore));
}

// write a function that fetches all chores for a projectId and a participant id
export async function getChoresByProjectIdAndParticipantId(
  projectId,
  participantId,
) {
  const chores = await sql`
  SELECT
   chores.id as chore_id,
   chores.name as chore_name,
   chores.weight as chore_weight,
   chores.icon_name as chore_icon_name

FROM
  chores,
  project_chores
WHERE
 project_chores.project_id = ${projectId}
AND
 project_chores.chore_id = chores.id
AND
 project_chores.assigned_participant_id = ${participantId}`;
  return chores.map((chore) => camelcaseKeys(chore));
}

// write a function that returns assigned project chores for a project id
export async function getAssignedChoresByProjectId(projectId) {
  const chores = await sql`
  SELECT
   chores.id as chore_id,
   chores.name as chore_name,
   chores.weight as chore_weight,
   chores.icon_name as chore_icon_name
  FROM
    chores,
    project_chores
  WHERE
    project_chores.project_id = ${projectId}
  AND
    project_chores.chore_id = chores.id
  AND
    project_chores.assigned_participant_id IS NULL`;
  return chores.map((chore) => camelcaseKeys(chore));
}
