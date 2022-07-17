import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../../../util/auth';
import {
  getParticipantsByProjectId,
  getValidSessionByToken,
  insertParticipant,
} from '../../../../../util/database';

// connecting to API methods GET and POST

export type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | { user: { id: number } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET

  if (req.method === 'GET') {
    // get participants from database
    const participants = await getParticipantsByProjectId(req.query.projectId);
    return res.status(200).json(participants);
  }

  // check for the csrfToken
  if (!req.body.csrfToken) {
    return res.status(400).json({
      error: 'no csrf token Found',
    });
  }
  // get csrfToken from the body
  const csrfToken = req.body.csrfToken;

  // get the sessionToken from the cookies
  const sessionToken = req.cookies.sessionToken;

  // get the session for this session Token
  const session = await getValidSessionByToken(sessionToken);

  // check if there is a session
  if (!session) {
    return res.status(403).json({
      error: 'unauthorized user',
    });
  }
  // validate csrf token against the seed in the database
  if (!(await verifyCsrfToken(session.csrfSecret, csrfToken))) {
    return res.status(403).json({
      error: 'csrf is not valid',
    });
  }

  // if method POST
  if (req.method === 'POST') {
    if (!req.body.participantName || !req.body.participantEmail) {
      return res.status(400).json({
        errors: [{ message: 'To add a user insert a name and an email' }],
      });
    }
    const newParticipant = await insertParticipant(
      req.body.participantName,
      req.body.participantEmail,
      req.body.projectId,
    );

    return res.status(200).json(newParticipant);
  }

  // return this if we use any method that is not allowed
  res.status(405).json({ errors: [{ message: 'method not allowed' }] });
}
