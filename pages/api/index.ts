import { NextApiRequest, NextApiResponse } from 'next';

// api to store participants names and their emails

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res
    .status(200)
    .json({ participants: 'http://localhost:3000/api/participants' });
  return;
}
