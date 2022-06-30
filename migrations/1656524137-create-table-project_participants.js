exports.up = async (sql) => {
  await sql`
CREATE TABLE project_participants (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	project_id integer REFERENCES projects (id) NOT NULL,
	participant_email text NOT NULL,
	participant_name varchar(50) NOT NULL
)
	`;
};

exports.down = async (sql) => {
  await sql`
DROP TABLE project_participants
`;
};
