exports.up = async (sql) => {
  await sql`
CREATE TABLE projectParticipant (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	project_id integer REFERENCES projects (id),
	participant_email text NOT NULL,
	participant_name varchar(50) NOT NULL
)
	`;
};

exports.down = async (sql) => {
  await sql`
DROP TABLE projectParticipant
`;
};
