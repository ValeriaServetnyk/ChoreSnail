exports.up = async (sql) => {
  await sql`
CREATE TABLE project_chores (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	project_id integer REFERENCES projects (id) UNIQUE,
	chore_id integer REFERENCES chores (id) UNIQUE,
	assigned_participant_id integer REFERENCES project_participants (id)

)
	`;
};

exports.down = async (sql) => {
  await sql`
DROP TABLE project_chores
`;
};
