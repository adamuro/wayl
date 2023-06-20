import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc';

const currentUserRouter = createTRPCRouter({
  get: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({ where: { id: ctx.userId } });
  }),
  getFollowed: privateProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: {
        followers: {
          some: {
            id: ctx.userId,
          },
        },
      },
    });
  }),
});

export const usersRouter = createTRPCRouter({
  current: currentUserRouter,
  getByName: privateProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!input.name)
        return ctx.prisma.user.findMany({
          where: {
            followers: {
              some: {
                id: ctx.userId,
              },
            },
          },
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            followers: true,
          },
        });

      return ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          followers: true,
        },
        where: {
          id: {
            not: ctx.userId,
          },
          name: {
            contains: input.name,
            mode: 'insensitive',
          },
        },
        orderBy: {
          followers: {
            _count: 'desc',
          },
        },
      });
    }),
});
