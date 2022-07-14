import { NextApiRequest, NextApiResponse } from 'next';
import {
  getParticipantsByProjectId,
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
    res.status(200).json(participants);
  }

  // if method POST
  if (req.method === 'POST') {
    if (!req.body.participantName || !req.body.participantEmail) {
      return res
        .status(400)
        .json({
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
  res.status(405).end();
}
