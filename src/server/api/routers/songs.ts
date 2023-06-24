import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '~/server/api/trpc';

export const songsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.song.findMany();
  }),
  create: privateProcedure
    .input(
      z.object({
        title: z.string(),
        authors: z.array(z.string()),
        imageUrl: z.string().url().optional(),
        uri: z.string().url(),
        themeId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.song.create({
        data: {
          title: input.title,
          authors: input.authors,
          imageUrl: input.imageUrl,
          uri: input.uri,
          themeId: input.themeId,
          userId: ctx.userId,
        },
      });
    }),
  getForCurrentUserAndTheme: privateProcedure.query(async ({ ctx }) => {
    const theme = await ctx.prisma.theme.findFirst({ where: { active: true } });
    if (!theme?.date) throw new TRPCError({ code: 'CONFLICT' });

    return ctx.prisma.song.findFirst({
      where: {
        userId: ctx.userId,
        theme: { active: true },
        createdAt: { gte: theme.date },
      },
      select: {
        id: true,
        title: true,
        authors: true,
        imageUrl: true,
        uri: true,
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }),
  getCurrentUserFeed: privateProcedure.query(async ({ ctx }) => {
    const theme = await ctx.prisma.theme.findFirst({ where: { active: true } });
    if (!theme?.date) throw new TRPCError({ code: 'CONFLICT' });

    return ctx.prisma.song.findMany({
      where: {
        theme: {
          active: true,
        },
        createdAt: {
          gte: theme.date,
        },
        user: {
          followers: {
            some: {
              id: ctx.userId,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        authors: true,
        imageUrl: true,
        uri: true,
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }),
});
