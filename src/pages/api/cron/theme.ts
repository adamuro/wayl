import type { NextApiRequest, NextApiResponse } from 'next';

export default function theme(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'success' });
}
