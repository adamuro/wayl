import type { NextPage } from 'next';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { IoPlay } from 'react-icons/io5';
import { If } from '~/components/condition';
import { api } from '~/utils/api';

const SongsSkeleton = () => {
  return (
    <ul className="absolute top-0 flex h-64 w-1/2 min-w-2xs flex-col overflow-y-scroll rounded-lg bg-black outline outline-1 outline-teal-400">
      <li className="flex h-14 animate-pulse cursor-pointer flex-col gap-2 px-4 pb-2 pt-4 transition-colors hover:bg-neutral-900">
        <div className="h-3 w-48 rounded-full bg-neutral-700"></div>
        <div className="h-2 w-20 rounded-full bg-neutral-700"></div>
      </li>
      <li className="flex h-14 animate-pulse cursor-pointer flex-col gap-2 px-4 pb-2 pt-4 transition-colors hover:bg-neutral-900">
        <div className="h-3 w-32 rounded-full bg-neutral-700"></div>
        <div className="h-2 w-16 rounded-full bg-neutral-700"></div>
      </li>
      <li className="flex h-14 animate-pulse cursor-pointer flex-col gap-2 px-4 pb-2 pt-4 transition-colors hover:bg-neutral-900">
        <div className="h-3 w-40 rounded-full bg-neutral-700"></div>
        <div className="h-2 w-24 rounded-full bg-neutral-700"></div>
      </li>
      <li className="flex h-14 animate-pulse cursor-pointer flex-col gap-2 px-4 pb-2 pt-4 transition-colors hover:bg-neutral-900">
        <div className="h-3 w-28 rounded-full bg-neutral-700"></div>
        <div className="h-2 w-12 rounded-full bg-neutral-700"></div>
      </li>
      <li className="flex h-14 animate-pulse cursor-pointer flex-col gap-2 px-4 pb-2 pt-4 transition-colors hover:bg-neutral-900">
        <div className="h-3 w-40 rounded-full bg-neutral-700"></div>
        <div className="h-2 w-16 rounded-full bg-neutral-700"></div>
      </li>
      <li className="flex h-14 animate-pulse cursor-pointer flex-col gap-2 px-4 pb-2 pt-4 transition-colors hover:bg-neutral-900">
        <div className="h-3 w-48 rounded-full bg-neutral-700"></div>
        <div className="h-2 w-12 rounded-full bg-neutral-700"></div>
      </li>
    </ul>
  );
};

const Theme = () => {
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const [song, setSong] = useState<SpotifyApi.TrackObjectFull | null>(null);

  const theme = api.themes.getActive.useQuery();
  const songs = api.spotify.searchSongs.useQuery({ query }, { keepPreviousData: true });

  /* TODO: Make this look pretty */
  const message = useMemo(() => {
    const content = theme.isLoading ? 'loading...' : theme.data?.content;
    if (theme.isError) return 'Oops, something went wrong 💀';
    return (
      <>
        {"Today's theme is"} <span className="text-teal-400">{content}</span>
      </>
    );
  }, [theme]);

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setSong(null);
    setQuery(e.target.value);
  };

  const handleSelectSong = (song: SpotifyApi.TrackObjectFull) => {
    setSong(song);
    setQuery(song.name);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(song?.id);
  };

  return (
    <section className="sticky top-0 z-50 bg-gradient-to-b from-black from-40% to-transparent p-4">
      <header className="flex flex-col items-center gap-6">
        <h2 className="text-center text-3xl">{message}</h2>
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
            onBlur={() => setFocus(false)}
            onChange={handleChangeQuery}
            className="w-full bg-transparent p-2 text-neutral-50 outline-none transition-all focus:border-teal-400"
          />
          <button
            disabled={!song}
            title={song ? 'Post!' : 'Choose a song'}
            className="p-2 text-xl transition-colors hover:text-teal-400 disabled:text-neutral-700"
          >
            <IoPlay />
          </button>
        </form>
      </header>
      <If cond={focus && query}>
        <div className="relative flex w-full justify-center">
          <div className="absolute top-0"></div>
          <If cond={songs.isFetching && !songs.data?.length}>
            <SongsSkeleton />
          </If>
          <If cond={songs.data?.length}>
            <ul className="absolute top-0 flex max-h-64 w-1/2 min-w-2xs flex-col overflow-y-scroll rounded-lg bg-black outline outline-1 outline-teal-400">
              {songs.data?.map((song) => (
                <li
                  key={song.id}
                  onMouseDown={() => handleSelectSong(song)}
                  className="flex cursor-pointer flex-col break-words px-4 py-2 transition-colors hover:bg-neutral-900 hover:text-teal-400"
                >
                  {song.name}
                  <span className="text-xs text-neutral-50">{song.artists[0]?.name}</span>
                </li>
              ))}
            </ul>
          </If>
        </div>
      </If>
    </section>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Theme />
      <ul className="select-none blur-sm">
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
        <li className="border-b border-neutral-700 p-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt sequi repellendus
          aliquam non maxime aspernatur est suscipit eveniet, sunt, temporibus, beatae eligendi
          delectus minima earum voluptas tempore corrupti iusto.
        </li>
      </ul>
    </>
  );
};

export default Home;
