import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByValidSessionToken } from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // method must be post
  if (req.method === 'GET') {
    const token = req.cookies.sessionToken;

    if (!token) {
      res
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
    }

    const user = await getUserByValidSessionToken(token);

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ message: 'Session token not valid' }] });
    }

    res.status(200).json({ user: user });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
