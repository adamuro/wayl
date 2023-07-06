import { verifySignature } from '@upstash/qstash/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/server/db';

async function getMostLikedIdea() {
  const mostLikedIdeas = await prisma.idea.findMany({
    select: {
      id: true,
      content: true,
      _count: {
        select: {
          upvoters: true,
        },
      },
    },
    orderBy: {
      upvoters: {
        _count: 'desc',
      },
    },
    take: 1,
  });

  return mostLikedIdeas.at(0);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const idea = await getMostLikedIdea();
  if (!idea) return res.status(500).json({ error: 'No ideas in database.' });
  if (!idea._count.upvoters) return res.status(500).json({ error: 'No liked ideas in database' });

  const [theme] = await prisma.$transaction([
    prisma.theme.create({ data: { content: idea.content } }),
    prisma.idea.delete({ where: { id: idea.id } }),
  ]);

  res.status(200).json(theme);
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
