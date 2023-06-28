import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '~/server/api/trpc';

export const ideasRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({ content: z.string().nonempty() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.idea.create({ data: { content: input.content } });
    }),
  getLiked: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.idea.findMany({
      select: {
        id: true,
        content: true,
        upvoters: true,
      },
      orderBy: {
        upvoters: {
          _count: 'desc',
        },
      },
    });
  }),
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.idea.findMany({
      select: {
        id: true,
        content: true,
        upvoters: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),
  like: privateProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return ctx.prisma.idea.update({
      where: {
        id: input.id,
      },
      data: {
        upvoters: {
          connect: {
            id: ctx.userId,
          },
        },
      },
    });
  }),
  unlike: privateProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return ctx.prisma.idea.update({
      where: {
        id: input.id,
      },
      data: {
        upvoters: {
          disconnect: {
            id: ctx.userId,
          },
        },
      },
    });
  }),
});
