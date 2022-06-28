import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteProjectById,
  getProjectById,
  updateProjectById,
} from '../../../util/database';

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
  res.status(405).json({ error: 'method not allowed' });
}
