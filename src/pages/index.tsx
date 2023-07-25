import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { IoPause, IoPlay } from 'react-icons/io5';
import { Avatar } from '~/components/avatar';
import { If } from '~/components/condition';
import { LoadingSpinner } from '~/components/loading';
import { Player } from '~/components/player';
import { SongSearchResultsSkeleton } from '~/components/skeleton';
import { useAudio } from '~/hooks/audio';
import { api, type RouterOutputs } from '~/utils/api';
import { cn } from '~/utils/cn';

type FeedSong = RouterOutputs['songs']['getCurrentUserFeed'][number];
type SpotifySong = RouterOutputs['spotify']['getSongs'][number];

const ThemeText = () => {
  const theme = api.themes.getActive.useQuery();

  return (
    <h2 className="text-center text-3xl [text-wrap:balance]">
      <If cond={theme.isError}>{'Oops, something went wrong 💀'}</If>
      <If cond={!theme.isError}>
        {"Today's theme is "}
        <span className="text-teal-400">
          {theme.isLoading ? (
            <span className="animate-pulse">loading...</span>
          ) : (
            theme.data?.content
          )}
        </span>
      </If>
    </h2>
  );
};

interface SongSearchResultsProps {
  songs: SpotifySong[];
  onSelect: (song: SpotifySong) => void;
}

const SongSearchResults = ({ songs, onSelect }: SongSearchResultsProps) => {
  const audio = useAudio();

  const handleSelect = (song: SpotifySong) => {
    audio.pause();
    onSelect(song);
  };

  const handlePreview = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, song: SpotifySong) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (audio.current === song.id) return audio.switch();
    audio.play(song);
  };

  return songs.map((song) => (
    <li
      key={song.id}
      onMouseDown={() => handleSelect(song)}
      className="flex cursor-pointer items-center gap-4 py-2 pl-4 transition-colors hover:bg-neutral-900 hover:text-teal-400"
    >
      <Image
        alt={`${song.name} album image`}
        src={song.album.images.at(-1)?.url || ''}
        width={36}
        height={36}
        className="h-9 w-9"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col break-words">
          <span className="font-medium leading-5">{song.name}</span>
          <span className="break-words text-xs text-neutral-50">
            {song.artists.map((artist) => artist.name).join(', ')}
          </span>
        </div>
        <button
          disabled={!song.preview_url}
          title={audio.playing && audio.current === song.id ? 'Pause' : 'Play'}
          onMouseDown={(e) => handlePreview(e, song)}
          className="p-2 text-neutral-50 transition-colors hover:text-teal-400 disabled:text-neutral-700"
        >
          {audio.playing && audio.current === song.id ? (
            <IoPause className="text-xl" />
          ) : (
            <IoPlay className="text-xl" />
          )}
        </button>
      </div>
    </li>
  ));
};

const Header = () => {
  const [query, setQuery] = useState('');
  const [song, setSong] = useState<SpotifySong | null>(null);
  const [focus, setFocus] = useState(false);
  const audio = useAudio();
  const theme = api.themes.getActive.useQuery();
  const userSong = api.songs.getForCurrentUserAndTheme.useQuery();
  const songs = api.spotify.getSongs.useQuery({ query }, { keepPreviousData: true });
  const createSong = api.songs.create.useMutation({
    onError: (error) => toast(error.message || 'Failed to post the song, please try again'),
    onSuccess: async () => {
      toast.success('Banger!');
      await userSong.refetch();
    },
  });

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setSong(null);
    setQuery(e.target.value);
    audio.pause();
  };

  const handleBlur = () => {
    setFocus(false);
    audio.pause();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!song || !theme.data) return;
    createSong.mutate({
      title: song.name,
      authors: song.artists.map((artist) => artist.name),
      imageUrl: song.album.images.at(-1)?.url,
      uri: song.uri,
      themeId: theme.data.id,
    });
  };

  const handleSelectSong = (song: SpotifySong) => {
    setSong(song);
    setQuery(song.name);
    audio.pause();
  };

  return (
    <>
      <header className="flex flex-col items-center gap-6">
        <ThemeText />
        <If cond={userSong.isFetched && !userSong.data}>
          <form
            onSubmit={handleSubmit}
            className="flex w-1/2 min-w-2xs rounded-lg border border-neutral-50 bg-black transition-colors focus-within:border-teal-400 hover:border-teal-400"
          >
            <input
              type="text"
              autoComplete="off"
              placeholder="Find a song..."
              value={query}
              required
              onFocus={() => setFocus(true)}
              onBlur={handleBlur}
              onChange={handleChangeQuery}
              className="w-full bg-transparent p-2 text-neutral-50 outline-none transition-all focus:border-teal-400"
            />
            <button
              disabled={!song || !theme.data}
              title={song ? 'Post!' : 'Choose a song'}
              className="p-2 pr-3 text-xl transition-colors hover:text-teal-400 disabled:text-neutral-700"
            >
              {createSong.isLoading || userSong.isLoading ? <LoadingSpinner /> : <IoPlay />}
            </button>
          </form>
        </If>
      </header>
      <If cond={focus && query}>
        <div className="relative flex w-full justify-center">
          <div className="absolute top-0"></div>
          <ul className="absolute top-0 flex max-h-64 w-1/2 min-w-2xs flex-col overflow-y-scroll rounded-lg bg-black outline outline-1 outline-teal-400">
            {songs.data?.length ? (
              <SongSearchResults songs={songs.data} onSelect={handleSelectSong} />
            ) : songs.isFetching ? (
              <SongSearchResultsSkeleton />
            ) : (
              <li className="flex cursor-pointer flex-col break-words px-4 py-2 transition-colors hover:bg-neutral-900 hover:text-teal-400">
                No results
              </li>
            )}
          </ul>
        </div>
      </If>
    </>
  );
};

interface FeedSongProps {
  song: FeedSong;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export const FeedSong = ({ song, isPlaying, onPlay, onPause }: FeedSongProps) => {
  return (
    <li className="group flex items-center justify-between transition-colors hover:bg-neutral-900">
      <div className="flex items-center gap-4 py-4 pl-4">
        <Avatar name={song.user.name} url={song.user.avatarUrl} />
        <div className="hidden w-full sm:flex">
          <div className="flex flex-col break-words">
            <span className="font-semibold leading-5 group-hover:text-teal-400">
              {song.user.name}
            </span>
            <span className="break-words text-xs text-neutral-50">
              {formatDistanceToNowStrict(song.createdAt)} ago
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4">
        <div className="flex w-full items-center justify-between text-right">
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
      </div>
    </li>
  );
};

const Home: NextPage = () => {
  const [playing, setPlaying] = useState<FeedSong | null>(null);
  const [play, setPlay] = useState(false);
  const feed = api.songs.getCurrentUserFeed.useQuery();
  const userSong = api.songs.getForCurrentUserAndTheme.useQuery();

  const handlePlaySong = (song: FeedSong) => {
    setPlaying(song);
    setPlay(true);
  };

  return (
    <>
      <section
        className={cn(
          'sticky top-0 z-50 p-4',
          userSong.data
            ? 'border-b border-neutral-700 bg-black'
            : 'bg-gradient-to-b from-black from-40% to-transparent',
        )}
      >
        <Header />
      </section>
      <section className="h-full">
        <ul className={userSong.data ? '' : 'pointer-events-none select-none blur-sm'}>
          {userSong.data ? (
            <FeedSong
              key={userSong.data.id}
              song={userSong.data}
              isPlaying={play && userSong.data.id === playing?.id}
              onPlay={() => (userSong.data ? handlePlaySong(userSong?.data) : null)}
              onPause={() => setPlay(false)}
            />
          ) : null}
          {feed.data?.map((song) => (
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

export default Home;
