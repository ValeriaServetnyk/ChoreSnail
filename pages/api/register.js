import bcrypt from 'bcrypt';
import { createUser, getUserByUsername } from '../../util/database';

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
        .status(401)
        .json({ errors: [{ message: 'username or password not provided' }] });
      return;
    }

    if (await getUserByUsername(req.body.username)) {
      res.status(401).json({ errors: [{ message: 'username already taken' }] });
      return;
    }
    // hash password
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    // create new user
    const newUser = await createUser(req.body.username, passwordHash);

    res.status(200).json({ user: { id: newUser.id } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
