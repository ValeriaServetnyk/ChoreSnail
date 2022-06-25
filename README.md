This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Database Setup

Copy the .env.example file to a new file called .env (ignored from Git) and fill in the necessary information.

Follow the instructions from the PostgreSQL step in UpLeveled's System Setup Instructions.

Then, connect to the built-in postgres database as administrator in order to create the database:

# Windows

If it asks for a password, use postgres.

psql -U postgres

# macOS

psql postgres

# Linux

sudo -u postgres psql

Once you have connected, run the following to create the database:

CREATE DATABASE <database name>;
CREATE USER <user name> WITH ENCRYPTED PASSWORD '<user password>';
GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;

Quit psql using the following command:

\q

On Linux, you will also need to create a Linux system user with a name matching the user name you used in the database. It will prompt you to create a password for the user - choose the same password as for the database above.

sudo adduser <user name>

Once you're ready to use the new user, reconnect using the following command.

# Windows and macOS:

psql -U <user name> <database name>

# Linux:

sudo -u <user name> psql -U <user name> <database name>

## API Design

Base URL (development): http://localhost:3000/api/

Reading all users: GET /animals ===> api/participants/index.js

Creating a new user: POST /animals ===> api/participants/index.js

Reading a single user: GET /animals/:id ===> api/participants/[participantid].js

Deleting a user: DELETE /animals/:id ===> api/participants/[participantid].js

Updating a user: PUT /animals/:id ===> api/participants/[participantid].js
