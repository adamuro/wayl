import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/server/db';

export default async function theme(req: NextApiRequest, res: NextApiResponse) {
  await prisma.theme.update({ where: { id: 1 }, data: { date: new Date() } });
  res.status(200).json({ message: 'success' });
}
