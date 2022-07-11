exports.up = async (sql) => {
  await sql`
CREATE TABLE project_chores (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	project_id integer REFERENCES projects (id),
	chore_id integer REFERENCES chores (id),
	assigned_participant_id integer REFERENCES project_participants (id),
	unique(project_id, chore_id)
)
	`;
};

exports.down = async (sql) => {
  await sql`
DROP TABLE project_chores
`;
};
