exports.up = async (sql) => {
  await sql`
CREATE TABLE chores (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name varchar(40) NOT NULL,
	weight integer NOT NULL,
	creator_id integer REFERENCES users (id),
	icon_name varchar(40) NOT NULL
)
	`;
};

exports.down = async (sql) => {
  await sql`
DROP TABLE chores
`;
};
