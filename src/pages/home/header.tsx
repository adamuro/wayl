import { useState, type ChangeEvent, type FormEvent } from 'react';
import { IoPlay } from 'react-icons/io5';
import { If } from '~/components/condition';
import { LoadingSpinner } from '~/components/loading';
import { SongSearchResultsSkeleton } from '~/components/skeleton';
import { useAudio } from '~/hooks/audio';
import { api } from '~/utils/api';
import { SongSearchResults, type SpotifySong } from './search';
import { ThemeText } from './theme';

export const Header = () => {
  const [query, setQuery] = useState('');
  const [song, setSong] = useState<SpotifySong | null>(null);
  const [focus, setFocus] = useState(false);
  const audio = useAudio();
  const theme = api.themes.getActive.useQuery();
  const userSong = api.songs.getForCurrentUserAndTheme.useQuery();
  const songs = api.spotify.getSongs.useQuery({ query }, { keepPreviousData: true });
  const createSong = api.songs.create.useMutation({ onSuccess: () => userSong.refetch() });

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
