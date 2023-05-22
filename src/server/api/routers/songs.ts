import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const songsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.song.findMany();
  }),
});
