import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteParticipantById,
  getParticipantById,
  updateParticipantById,
} from '../../../util/database';

// connecting to API method GETbyId PUT and DELETE

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const participantId = req.query.participantId;

  if (!participantId) {
    return res.status(400).json({ error: 'must be a valid id' });
  }

  if (req.method === 'GET') {
    const participant = await getParticipantById(participantId);

    if (!participant) {
      return res.status(400).json({ error: 'must be a valid id' });
    }
    return res.status(200).json(participant);
  }

  if (req.method === 'PUT') {
    if (
      !participantId ||
      !req.body.participantName ||
      !req.body.participantEmail
    ) {
      return res
        .status(400)
        .json({ error: 'need to add valid id name and email' });
    }
    const updatedParticipant = await updateParticipantById(
      participantId,
      req.body.participantName,
      req.body.participantEmail,
    );
    return res.status(200).json(updatedParticipant);
  }

  if (req.method === 'DELETE') {
    const deletedParticipant = await deleteParticipantById(participantId);

    return res.status(200).json(deletedParticipant);
  }
  // if other method used that is not allowed
  res.status(405).json({ error: 'method not allowed' });
}
