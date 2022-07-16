import { NextApiRequest, NextApiResponse } from 'next';
import {
  getChoresByProjectIdAndParticipantId,
  setAssignedParticipantId,
} from '../../../../../../util/database';

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
  // if method GET

  if (req.method === 'GET') {
    const participantsChores = await getChoresByProjectIdAndParticipantId(
      req.query.projectId,
      req.query.participantId,
    );

    res.status(200).json(participantsChores);
  }

  // if method POST
  if (req.method === 'POST') {
    if (!req.body.choreIds) {
      return res.status(400).json({
        errors: [
          { message: 'pick chores for participants in order to proceed' },
        ],
      });
    }
    const assignChores = await setAssignedParticipantId(
      req.body.projectId,
      req.body.choreIds,
      req.body.participantId,
    );

    return res.status(200).json(assignChores);
  }

  // return this if we use any method that is not allowed
  res.status(405).end();
}
