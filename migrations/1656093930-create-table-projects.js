exports.up = async (sql) => {
  await sql`
CREATE TABLE projects (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	project_name varchar(40) NOT NULL,
	creator_id integer REFERENCES users (id)

)
	`;
};

exports.down = async (sql) => {
  await sql`
DROP TABLE projects
`;
};
