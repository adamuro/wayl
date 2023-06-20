import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import Spotify from 'spotify-web-api-node';
import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc';

const spotify = new Spotify();

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

      const tokens = await clerkClient.users.getUserOauthAccessToken(ctx.userId, 'oauth_spotify');
      if (!tokens[0]) throw new TRPCError({ code: 'FORBIDDEN' });

      const { token } = tokens[0];
      spotify.setAccessToken(token);
      const songs = searchSongs(input.query);
      return songs;
    }),
});
