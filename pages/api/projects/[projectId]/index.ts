import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../../util/auth';
import {
  deleteProjectById,
  getProjectById,
  getValidSessionByToken,
  updateProjectById,
} from '../../../../util/database';

// connecting to API method GETbyId PUT and DELETE

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const projectId = req.query.projectId;

  if (!projectId) {
    return res.status(400).json({ error: 'must be a valid id' });
  }

  if (req.method === 'GET') {
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(400).json({ error: 'must be a valid id' });
    }
    return res.status(200).json(project);
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
    if (!projectId || !req.body.projectName) {
      return res.status(400).json({ error: 'need to add valid id and name' });
    }
    const updatedProject = await updateProjectById(
      projectId,
      req.body.projectName,
    );
    return res.status(200).json(updatedProject);
  }

  if (req.method === 'DELETE') {
    const deletedProject = await deleteProjectById(projectId);

    return res.status(200).json(deletedProject);
  }
  // if other method used that is not allowed
  res.status(405).json({ errors: [{ message: 'method not allowed' }] });
}
