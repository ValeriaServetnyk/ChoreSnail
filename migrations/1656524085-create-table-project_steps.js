exports.up = async (sql) => {
  await sql`
CREATE TABLE project_steps (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	step_name varchar(80) NOT NULL UNIQUE
)
	`;
};

exports.down = async (sql) => {
  await sql`
DROP TABLE project_steps
`;
};
