// import fs from 'node:fs';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

config();

// connect only once to database to prevent running out of slots

function connectOneTimeToDatabase() {
  if(!globalThis.postgresSqlClient) {
    globalThis.postgresSqlClient = postgres();
  }
  const sql = globalThis.postgresSqlClient;

  return sql;
}
const sql = connectOneTimeToDatabase();

export async function getChores() {
  const chores = await sql`
SELECT * from chores`;
return chores;
}
