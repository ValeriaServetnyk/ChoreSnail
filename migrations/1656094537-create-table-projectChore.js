exports.up = async (sql) => {
	await sql`
CREATE TABLE projectChore (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	project_id integer REFERENCES projects (id),
	chore_id integer REFERENCES chores (id)

)
	`;
}

exports.down = async (sql) => {
await sql`
DROP TABLE projectChore
`;
}