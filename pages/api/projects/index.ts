import { NextApiRequest, NextApiResponse } from 'next';
import { getProjects, insertProject } from '../../../util/database';

// connecting to API methods GET and POST

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET

  if (req.method === 'GET') {
    // get participants from database
    const projects = await getProjects();
    res.status(200).json(projects);
  }

  // if method POST
  if (req.method === 'POST') {
    if (!req.body.projectName) {
      return res.status(400).json({ error: 'to add a project insert name' });
    }
    const newProject = await insertProject(
      req.body.projectName,
      req.body.creatorId,
    );
    return res.status(200).json(newProject);
  }
  // return this if we use any method that is not allowed
  res.status(405).end();
}
