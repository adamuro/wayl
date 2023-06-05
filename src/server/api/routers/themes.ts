import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const themesRouter = createTRPCRouter({
  getActive: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.theme.findFirst({
      where: {
        active: true,
      },
      select: {
        id: true,
        content: true,
      },
    });
  }),
});
