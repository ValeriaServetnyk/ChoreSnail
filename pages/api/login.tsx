import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { createCSRFSecret } from '../../util/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  getUserWithPasswordHashByUsername,
} from '../../util/database';

// api route to authorise the user based on the registration info. Backend for login page

export type LoginResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | { user: { id: number; username: string } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponseBody>,
) {
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
    const username = userWithPasswordHash.username;

    const token = crypto.randomBytes(80).toString('base64');

    const csrfSecret = createCSRFSecret();

    const session = await createSession(token, userId, csrfSecret);

    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    // tell the browser to create the cookie

    res
      .status(200)
      .setHeader('set-Cookie', serializedCookie)
      .json({ user: { id: userId, username: username } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
