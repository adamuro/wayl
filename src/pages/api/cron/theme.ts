import { verifySignature } from '@upstash/qstash/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/server/db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await prisma.theme.update({ where: { id: 1 }, data: { date: new Date() } });
  res.status(200).end();
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
