import { type GetStaticProps, type NextPage } from 'next';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import avatarDefault from '~/assets/avatar-default.png';
import { Player } from '~/components/player';
import { type RouterOutputs, api } from '~/utils/api';
import { IoPause, IoPlay } from 'react-icons/io5';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { MdPersonAddAlt1, MdPersonRemoveAlt1 } from 'react-icons/md';
import { If } from '~/components/condition';
import { UserProfileHeaderSkeleton } from '~/components/skeleton';

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

type Song = RouterOutputs['songs']['getByUserId'][number];

interface SongProps {
  song: Song;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export const FeedSong = ({ song, isPlaying, onPlay, onPause }: SongProps) => {
  return (
    <li className="group flex items-center justify-between transition-colors hover:bg-neutral-900">
      <div className="flex items-center gap-4 p-4">
        <div className="flex items-center">
          <div className="items h-10 w-10">
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="group/play relative cursor-pointer hover:text-teal-400"
            >
              <Image
                alt={`${song.title} album image`}
                src={song.imageUrl || ''}
                width={40}
                height={40}
                className="relative z-20 h-10 w-10 transition-opacity group-hover/play:opacity-50"
              />
              <div
                data-playing={isPlaying}
                className="absolute top-0 z-20 flex h-10 w-10 items-center justify-center opacity-80 transition-opacity group-hover/play:opacity-100 data-[playing=true]:opacity-100"
              >
                {isPlaying ? (
                  <IoPause className="text-2xl transition-colors" />
                ) : (
                  <IoPlay className="text-2xl transition-colors" />
                )}
              </div>
            </button>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col break-words">
            <span
              data-playing={isPlaying}
              className="font-semibold leading-5 transition-colors group-hover:text-teal-400 data-[playing=true]:text-teal-400"
            >
              {song.title}
            </span>
            <span className="break-words text-xs text-neutral-50">{song.authors.join(', ')}</span>
          </div>
        </div>
      </div>
      <div className="hidden items-center gap-4 py-4 pr-4 text-right sm:flex">
        <div className="w-full">
          <div className="flex flex-col break-words">
            <span className="w-fit font-semibold leading-5 first-letter:capitalize group-hover:text-teal-400">
              {song.theme.content}
            </span>
            <span className="break-words text-xs text-neutral-50">
              {formatDistanceToNowStrict(song.createdAt)} ago
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

const UserProfile: NextPage<{ id: string }> = ({ id }) => {
  const { userId } = useAuth();
  const [error, setError] = useState(false);
  const [play, setPlay] = useState(false);
  const [playing, setPlaying] = useState<Song | null>(null);
  const trpc = api.useContext();
  const user = api.users.getById.useQuery({ id });
  const songs = api.songs.getByUserId.useQuery({ id });

  const followed = useMemo(
    () => userId && user.data?.followers.some(({ id }) => id === userId),
    [userId, user],
  );

  const follow = api.users.current.follow.useMutation({
    onSuccess: () => trpc.users.invalidate(),
    onSettled: () => trpc.users.getFollowersById.invalidate(),
    onError: (error) => toast.error(error.message || 'Something went wrong 💀'),
    onMutate: async () => {
      if (!userId) return;

      await trpc.users.getById.cancel();
      trpc.users.getById.setData({ id }, (user) => {
        if (!user) return user;
        return { ...user, followers: [...user.followers, { id: userId }] };
      });
    },
  });

  const unfollow = api.users.current.unfollow.useMutation({
    onSuccess: () => trpc.users.invalidate(),
    onSettled: () => trpc.users.getFollowersById.invalidate(),
    onError: (error) => toast.error(error.message || 'Something went wrong 💀'),
    onMutate: async () => {
      if (!userId) return;

      await trpc.users.getById.cancel();
      trpc.users.getById.setData({ id }, (user) => {
        if (!user) return user;
        return { ...user, followers: user.followers.filter(({ id }) => id !== userId) };
      });
    },
  });

  const handleFollow = useCallback(() => {
    const toggleFollow = followed ? unfollow : follow;
    toggleFollow.mutate({ id });
  }, [id, followed, follow, unfollow]);

  const handlePlaySong = (song: Song) => {
    setPlaying(song);
    setPlay(true);
  };

  return (
    <>
      <section className="sticky top-0 z-50 border-b border-neutral-700 bg-black p-4">
        <header className="flex flex-col items-center gap-2">
          <If cond={user.data && userId !== id}>
            <button
              onClick={handleFollow}
              title={followed ? 'Unfollow' : 'Follow'}
              className="absolute right-4 top-4 rounded-lg border border-teal-400 p-2 text-2xl text-neutral-50 transition-colors hover:bg-neutral-900 hover:text-teal-400"
            >
              {followed ? <MdPersonRemoveAlt1 /> : <MdPersonAddAlt1 />}
            </button>
          </If>
          {user.data ? (
            <>
              <Image
                alt={`${user.data?.name} profile picture`}
                src={error ? avatarDefault : user.data.avatarUrl}
                width={56}
                height={56}
                onError={() => setError(true)}
                className="h-14 w-14 rounded-full border border-teal-400"
              />
              <div>
                <h2 className="text-center text-2xl font-semibold text-teal-400">
                  {user.data.name}
                </h2>
                <h3 className="flex text-center">
                  {formatter.format(user.data.followers.length)}
                  {user.data.followers.length === 1 ? ' follower' : ' followers'}
                  {' • '}
                  {formatter.format(user.data._count.songs)}
                  {user.data._count.songs === 1 ? ' song' : ' songs'}
                </h3>
              </div>
            </>
          ) : (
            <UserProfileHeaderSkeleton />
          )}
        </header>
      </section>
      <section className="h-full">
        <ul>
          {songs.data?.map((song) => (
            <FeedSong
              key={song.id}
              song={song}
              isPlaying={play && song.id === playing?.id}
              onPlay={() => handlePlaySong(song)}
              onPause={() => setPlay(false)}
            />
          ))}
        </ul>
      </section>
      <section className="sticky bottom-0 z-50 flex border-t border-neutral-700 bg-black">
        <Player
          play={play}
          onPlay={() => setPlay(true)}
          onPause={() => setPlay(false)}
          uri={playing?.uri}
        />
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context.params?.id;
  if (typeof id !== 'string') throw new Error('Invalid id');

  return {
    props: {
      id: `user_${id}`,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};

export default UserProfile;
