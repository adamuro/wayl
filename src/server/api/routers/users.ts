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
  follow: privateProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.user.update({
      where: {
        id: ctx.userId,
      },
      data: {
        following: {
          connect: {
            id: input.id,
          },
        },
      },
    });
  }),
  unfollow: privateProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.user.update({
      where: {
        id: ctx.userId,
      },
      data: {
        following: {
          disconnect: {
            id: input.id,
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
            followers: {
              select: {
                id: true,
              },
            },
          },
        });

      return ctx.prisma.user.findMany({
        where: {
          id: {
            not: ctx.userId,
          },
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
  getFollowersById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          followers: {
            select: {
              id: true,
            },
          },
        },
      });

      return user?.followers;
    }),
});
