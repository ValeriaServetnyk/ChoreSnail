import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../../../util/auth';
import {
  getAssignedChoresByProjectId,
  getValidSessionByToken,
} from '../../../../../util/database';

export type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | { user: { id: number } };

// connecting to API methods GET and POST

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // // if method GET

  if (req.method === 'GET') {
    // get participants from database
    const chores = await getAssignedChoresByProjectId(req.query.projectId);
    return res.status(200).json(chores);
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

  // return this if we use any method that is not allowed
  res.status(405).json({ errors: [{ message: 'method not allowed' }] });
}
