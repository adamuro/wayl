import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '~/server/api/trpc';

const currentUserRouter = createTRPCRouter({
  getSongForActiveTheme: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({ where: { clerkId: ctx.clerkId } });
    if (!user) throw new TRPCError({ code: 'CONFLICT' });

    const theme = await ctx.prisma.theme.findFirst({ where: { active: true } });
    if (!theme?.date) throw new TRPCError({ code: 'CONFLICT' });

    return ctx.prisma.song.findFirst({
      where: {
        userId: user.id,
        theme: { active: true },
        createdAt: { gte: theme.date },
      },
    });
  }),
  getNotFollowedByName: privateProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({ where: { clerkId: ctx.clerkId } });
      if (!user) throw new TRPCError({ code: 'CONFLICT' });

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
          followers: {
            none: {
              id: user.id,
            },
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

export const usersRouter = createTRPCRouter({
  current: currentUserRouter,
  getByName: publicProcedure.input(z.object({ name: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        followers: true,
      },
      where: {
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
