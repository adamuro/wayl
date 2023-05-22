import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const usersRouter = createTRPCRouter({
  getByName: publicProcedure.input(z.object({ name: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.user.findMany({
      where: {
        name: {
          contains: input.name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        followers: true,
      },
      orderBy: {
        followers: {
          _count: 'desc',
        },
      },
    });
  }),
});
