exports.up = async (sql) => {
  await sql`
CREATE TABLE sessions (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	token varchar(110) NOT NULL UNIQUE,
	expiry_timestamp timestamp(80) NOT NULL DEFAULT NOW() + INTERVAL '24 HOURS',
	user_id integer REFERENCES users (id) ON DELETE CASCADE
)
	`;
};

exports.down = async (sql) => {
  await sql`
DROP TABLE sessions
`;
};
