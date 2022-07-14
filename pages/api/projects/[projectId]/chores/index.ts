import { NextApiRequest, NextApiResponse } from 'next';
import {
  getChoresByProjectId,
  insertChoresIntoProject,
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
    const chores = await getChoresByProjectId(req.query.projectId);
    res.status(200).json(chores);
  }

  // if method POST
  if (req.method === 'POST') {
    if (!req.body.choreId) {
      return res
        .status(400)
        .json({ errors: [{ message: 'please add chores to your project' }] });
    }
    const newChoresList = await insertChoresIntoProject(
      req.body.projectId,
      req.body.choreId,
    );

    return res.status(200).json(newChoresList);
  }

  // return this if we use any method that is not allowed
  res.status(405).end();
}
