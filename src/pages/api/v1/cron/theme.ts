import { verifySignature } from '@upstash/qstash/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/server/db';

async function getRandomAvailableTheme() {
  const availableThemes = await prisma.theme.findMany({ where: { available: true } });
  return availableThemes.at(Math.floor(Math.random() * availableThemes.length));
}

async function getOldestTheme() {
  const oldestThemes = await prisma.theme.findMany({ orderBy: { date: 'asc' }, take: 1 });
  return oldestThemes.at(0);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const id = (await getRandomAvailableTheme())?.id || (await getOldestTheme())?.id;
  if (!id) return res.status(500).json({ error: 'No themes in database.' });

  const theme = await prisma.theme.update({
    where: { id },
    data: {
      date: new Date(),
      active: true,
      available: false,
    },
  });

  res.status(200).json(theme);
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
