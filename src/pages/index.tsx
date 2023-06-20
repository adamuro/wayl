import type { NextPage } from 'next';
import Image from 'next/image';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { IoPause, IoPlay } from 'react-icons/io5';
import { If } from '~/components/condition';
import { LoadingSpinnerSm } from '~/components/loading';
import { SongSearchResultsSkeleton } from '~/components/skeleton';
import { useAudio } from '~/hooks/audio';
import { api } from '~/utils/api';

const Home: NextPage = () => {
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const [song, setSong] = useState<SpotifyApi.TrackObjectFull | null>(null);
  const theme = api.themes.getActive.useQuery();
  const songs = api.spotify.getSongs.useQuery({ query }, { keepPreviousData: true });
  const userSong = api.songs.getForCurrentUserAndTheme.useQuery();
  const createSong = api.songs.create.useMutation({ onSuccess: () => userSong.refetch() });
  const audio = useAudio();

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setSong(null);
    setQuery(e.target.value);
    audio.pause();
  };

  const handleBlur = () => {
    setFocus(false);
    audio.pause();
  };

  const handleSelectSong = (song: SpotifyApi.TrackObjectFull) => {
    setSong(song);
    setQuery(song.name);
    audio.pause();
  };

  const handlePreviewSong = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    song: SpotifyApi.TrackObjectFull,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (audio.current === song.id) return audio.switch();
    audio.play(song);
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

  return (
    <>
      <section
        className={`sticky top-0 z-50 p-4 ${
          userSong.isFetched && userSong.data
            ? 'border-b border-neutral-700 bg-black'
            : 'bg-gradient-to-b from-black from-40% to-transparent'
        }`}
      >
        <header className="flex flex-col items-center gap-6">
          <h2 className="text-center text-3xl">
            <If cond={theme.isError}>{'Oops, something went wrong 💀'}</If>
            <If cond={!theme.isError}>
              {"Today's theme is "}
              <span className="text-teal-400">
                {theme.isLoading ? 'loading...' : theme.data?.content}
              </span>
            </If>
          </h2>
          <If cond={userSong.isFetched && !userSong.data}>
            <form
              onSubmit={handleSubmit}
              className="flex w-1/2 min-w-2xs rounded-lg border border-neutral-50 bg-black transition-colors focus-within:border-teal-400 hover:border-teal-400"
            >
              <input
                type="text"
                autoComplete="off"
                placeholder="Search..."
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
                {createSong.isLoading || userSong.isLoading ? <LoadingSpinnerSm /> : <IoPlay />}
              </button>
            </form>
          </If>
        </header>
        <If cond={focus && query}>
          <div className="relative flex w-full justify-center">
            <div className="absolute top-0"></div>
            <If cond={!songs.data?.length}>
              <If cond={songs.isFetching}>
                <SongSearchResultsSkeleton />
              </If>
              <If cond={!songs.isFetching}>
                <ul className="absolute top-0 flex max-h-64 w-1/2 min-w-2xs flex-col overflow-y-scroll rounded-lg bg-black outline outline-1 outline-teal-400">
                  <li className="flex cursor-pointer flex-col break-words px-4 py-2 transition-colors hover:bg-neutral-900 hover:text-teal-400">
                    No results
                  </li>
                </ul>
              </If>
            </If>
            <If cond={songs.data?.length}>
              <ul className="absolute top-0 flex max-h-64 w-1/2 min-w-2xs flex-col overflow-y-scroll rounded-lg bg-black outline outline-1 outline-teal-400">
                {songs.data?.map((song) => (
                  <li
                    key={song.id}
                    onMouseDown={() => handleSelectSong(song)}
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
                        <span className="leading-5">{song.name}</span>
                        <span className="break-words text-xs text-neutral-50">
                          {song.artists.map((artist) => artist.name).join(', ')}
                        </span>
                      </div>
                      <button
                        disabled={!song.preview_url}
                        title={audio.playing && audio.current === song.id ? 'Pause' : 'Play'}
                        onMouseDown={(e) => handlePreviewSong(e, song)}
                        className="p-2 text-neutral-50 transition-colors hover:text-teal-400 disabled:text-neutral-700"
                      >
                        <If cond={audio.paused || audio.current !== song.id}>
                          <IoPlay className="text-xl" />
                        </If>
                        <If cond={audio.playing && audio.current === song.id}>
                          <IoPause className="text-xl" />
                        </If>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </If>
          </div>
        </If>
      </section>
      <section>
        <ul className={userSong.data ? '' : 'select-none blur-sm'}>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
          <li className="border-b border-neutral-700 p-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi
            repellendus aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae
            eligendi delectus minima earum voluptas tempore corrupti iusto.
          </li>
        </ul>
      </section>
    </>
  );
};

export default Home;
