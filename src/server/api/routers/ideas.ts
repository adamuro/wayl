import { TRPCError } from '@trpc/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '~/server/api/trpc';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1m'),
  analytics: true,
});

export const ideasRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({ content: z.string().nonempty() }))
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(`ideas-${ctx.userId}`);
      if (!success)
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'You have created too many ideas recently',
        });

      return ctx.prisma.idea.create({
        data: {
          content: input.content,
          authorId: ctx.userId,
        },
      });
    }),
  getLiked: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.idea.findMany({
      select: {
        id: true,
        content: true,
        upvoters: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
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
        createdAt: true,
        author: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
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
