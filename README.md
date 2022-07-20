# Choresnail - fully responsive web app built with Next.js

Responsive web app for dividing the load of the household projects equally among participants. Users can create their household projects in the app, assign participants, and pick from the list of chores to add to their projects. Users then can assign the chores to the participants based on their load, making sure that each participant got an equal amount of work.

**Coming soon:**

1. Automatic assign, when the app assigns the chores based on the load per participant.
2. Review section where users can comment on the past projects or re-initiate them

**Technologies:**

- Client: Next.js, React, Typescript, Emotion JS, Material UI
- Server: Node.js, PostgreSQL
- Testing: Playwright, Jest

## User roadmap

<div><img src="/public/app1.png" width="300" height="580">
<img src="/public/app2.png" width="300" height="580"></div>
<div><img src="/public/app3.png" width="300" height="580">
<img src="/public/app4.png" width="300" height="580"></div>
<div><img src="/public/app5.png" width="300" height="580">
<img src="/public/app6.png" width="300" height="580"></div>
<img src="/public/app7.png" width="300" height="580">
<img src="/public/app8.png" width="580" height="380">

## Setup

Clone the repo from GitHub and then install the dependencies:

```
git clone https://github.com/ValeriaServetnyk/choresnail.git
cd choresnail
yarn
```

Setup a database with postgres on your computer:

```
psql <login>
CREATE DATABASE <database name>;
CREATE USER <username> WITH ENCRYPTED PASSWORD '<pw>';
GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;
```

Create a .env file with the user info for the database and create .env.example as a template file for user info

Use migrations:

```
yarn migrate up
```

To delete data from database run:

```
yarn migrate down
```

To run the development server:

```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To create the production build of the project run:

```
yarn build
yarn start
```

# Libraries

- Postgres.js
- @emotion/css
- JS Cookie
- dotenv-safe
- ley
- bcrypt
- nodemailer
- Gmail API

## Deployment

To deploy this project, create a [Heroku Account](https://signup.heroku.com/) and follow the instructions
Make sure ENV variables are passed to Heroku
Push to github to trigger th deployment

## API Design

Base URL (development): http://localhost:3000/api/

Reading all users: GET /participants ===> api/participants/index.js

Creating a new user: POST /participants ===> api/participants/index.js

Reading a single user: GET /participants/id ===> api/participants/[participantid].js

Deleting a user: DELETE /participants/id ===> api/participants/[participantid].js

Updating a user: PUT /participants/id ===> api/participants/[participantid].js

### Figma wireframing

https://www.figma.com/file/cIloP00K6DrXGd2A6B00TB/Prototype-final-project?node-id=0%3A1

<img src="/public/Wireframes.png" width="900" height="500">

### DrawSQL Database Schema

<img src="/public/database.png" width="900" height="500">
