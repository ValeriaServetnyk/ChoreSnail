import { getParticipants, insertParticipant } from '../../../util/database';

// connecting to API methods GET and POST

export default async function handler(req, res) {
  // if method GET

  if (req.method === 'GET') {
    // get participants from database
    const participants = await getParticipants();
    res.status(200).json(participants);
  }

  // if method POST
  if (req.method === 'POST') {
    if (!req.body.participantName || !req.body.participantEmail) {
      return res
        .status(400)
        .json({ error: 'to add a user insert name and email' });
    }
    const newParticipant = await insertParticipant(
      req.body.participantName,
      req.body.participantEmail,
    );
    return res.status(200).json(newParticipant);
  }
  // return this if we use any method that is not allowed
  res.status(405).end();
}
