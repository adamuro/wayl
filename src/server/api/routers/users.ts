import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc';

const currentUserRouter = createTRPCRouter({
  get: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({ where: { clerkId: ctx.clerkId } });
  }),
  getFollowed: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { clerkId: ctx.clerkId },
      select: { id: true },
    });
    if (!user) throw new TRPCError({ code: 'CONFLICT' });

    return ctx.prisma.user.findMany({
      where: {
        followers: {
          some: {
            id: user.id,
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
      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.clerkId },
        select: { id: true },
      });
      if (!user) throw new TRPCError({ code: 'CONFLICT' });

      if (!input.name)
        return ctx.prisma.user.findMany({
          where: {
            followers: {
              some: {
                id: user.id,
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
            not: user.id,
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
