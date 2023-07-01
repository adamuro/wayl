import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import Spotify from 'spotify-web-api-node';
import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc';

const spotify = new Spotify();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, '30s'),
  analytics: true,
});

async function searchSongs(query: string): Promise<SpotifyApi.TrackObjectFull[]> {
  return new Promise((resolve) => {
    spotify.searchTracks(query, { limit: 10 }, (error, data) => {
      if (error) throw error;
      if (!data.body.tracks) throw new Error('No songs found.');

      return resolve(data.body.tracks.items);
    });
  });
}

export const spotifyRouter = createTRPCRouter({
  getSongs: privateProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!input.query) return [];

      const { success } = await ratelimit.limit(`spotify-${ctx.userId}`);
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

      const tokens = await clerkClient.users.getUserOauthAccessToken(ctx.userId, 'oauth_spotify');
      if (!tokens[0]) throw new TRPCError({ code: 'FORBIDDEN' });

      const { token } = tokens[0];
      spotify.setAccessToken(token);
      const songs = searchSongs(input.query);
      return songs;
    }),
  getToken: privateProcedure.query(async ({ ctx }) => {
    const tokens = await clerkClient.users.getUserOauthAccessToken(ctx.userId, 'oauth_spotify');
    if (!tokens[0]) throw new TRPCError({ code: 'FORBIDDEN' });

    const { token } = tokens[0];
    return token;
  }),
});
