exports.up = async (sql) => {
	await sql`
CREATE TABLE users (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_name varchar(40) NOT NULL,
	user_password varchar(40) NOT NULL,
	email varchar(40) NOT NULL
)
	`;
}

exports.down = async (sql) => {
await sql`
DROP TABLE users
`;
}
