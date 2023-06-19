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
      const user = await ctx.prisma.user.findUnique({
        select: { id: true },
        where: { clerkId: ctx.clerkId },
      });

      if (!user) throw new TRPCError({ code: 'CONFLICT' });

      return ctx.prisma.song.create({
        data: {
          title: input.title,
          authors: input.authors,
          imageUrl: input.imageUrl,
          uri: input.uri,
          themeId: input.themeId,
          userId: user.id,
        },
      });
    }),
  getForCurrentUserAndTheme: privateProcedure.query(async ({ ctx }) => {
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
});
