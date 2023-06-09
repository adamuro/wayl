import { createTRPCRouter } from '~/server/api/trpc';
import { songsRouter } from './routers/songs';
import { themesRouter } from './routers/themes';
import { spotifyRouter } from './routers/spotify';
import { usersRouter } from './routers/users';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  songs: songsRouter,
  spotify: spotifyRouter,
  themes: themesRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
