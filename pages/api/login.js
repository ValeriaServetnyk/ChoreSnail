import bcrypt from 'bcrypt';
import { getUserWithPasswordHashByUsername } from '../../util/database';

// api route to store user registration info. Backend for signup page

// type RegisterResponseBody =
// | {
//   errors: {
//     message:string:
//   }[];
// }
// | { user: {id:number}};

export default async function handler(req, res) {
  // method must be post
  if (req.method === 'POST') {
    if (
      typeof req.body.username !== 'string' ||
      typeof req.body.password !== 'string' ||
      !req.body.username ||
      !req.body.password
    ) {
      res
        .status(400)
        .json({ errors: [{ message: 'username and password do not match' }] });
      return;
    }

    // do not expose
    const userWithPasswordHash = await getUserWithPasswordHashByUsername(
      req.body.username,
    );

    if (!userWithPasswordHash) {
      res
        .status(401)
        .json({ errors: [{ message: 'username and password do not match' }] });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userWithPasswordHash.passwordHash,
    );

    if (!passwordMatches) {
      res
        .status(401)
        .json({ errors: [{ message: 'username and password do not match' }] });
      return;
    }

    const userId = userWithPasswordHash.id;

    res.status(200).json({ user: { id: userId } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
