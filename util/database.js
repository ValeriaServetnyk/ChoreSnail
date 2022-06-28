import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

config();

// connect only once to database to prevent running out of slots

function connectOneTimeToDatabase() {
  if (!globalThis.postgresSqlClient) {
    globalThis.postgresSqlClient = postgres();
  }
  const sql = globalThis.postgresSqlClient;

  return sql;
}
const sql = connectOneTimeToDatabase();

export async function getChores() {
  const chores = await sql`
SELECT * from chores`;
  return camelcaseKeys(chores);
}

// return all from table project participant
export async function getParticipants() {
  const participants = await sql`
SELECT * from projectparticipant`;
  return participants.map((participant) => camelcaseKeys(participant));
}

// to return participant by id
export async function getParticipantById(id) {
  const [participant] = await sql`
SELECT * from projectparticipant
WHERE id = ${id}`;
  return camelcaseKeys(participant);
}

// to delete participant by id
export async function deleteParticipantById(id) {
  const [participant] = await sql`
DELETE FROM projectparticipant
WHERE id=${id}
RETURNING *`;
  return camelcaseKeys(participant);
}

// to insert participant
export async function insertParticipant(participantName, participantEmail) {
  const [participant] = await sql`
INSERT INTO projectparticipant
(participant_name, participant_email)
VALUES (${participantName}, ${participantEmail})
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
UPDATE projectparticipant
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

export async function insertProject(projectName) {
  const [project] = await sql`
INSERT INTO projects
(project_name)
VALUES (${projectName})
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
