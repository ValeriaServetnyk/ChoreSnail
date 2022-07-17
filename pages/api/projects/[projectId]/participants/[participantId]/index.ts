import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../../../../util/auth';
import {
  deleteParticipantById,
  getParticipantById,
  getValidSessionByToken,
  updateParticipantById,
} from '../../../../../../util/database';

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

  if (req.method === 'PUT') {
    if (
      !participantId ||
      !req.body.participantName ||
      !req.body.participantEmail
    ) {
      return res
        .status(400)
        .json({ errors: [{ message: 'need to add valid id name and email' }] });
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
  res.status(405).json({ errors: [{ message: 'method not allowed' }] });
}
