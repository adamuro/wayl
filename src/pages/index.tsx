import type { NextPage } from 'next';
import { useMemo, useState, type FormEvent } from 'react';
// import * from 'spotify-api'
import { IoPlay } from 'react-icons/io5';
import { api } from '~/utils/api';

const Theme = () => {
  const [value, setValue] = useState('');
  const [focus, setFocus] = useState(false);

  const { data: theme, isError, isLoading } = api.themes.getActive.useQuery();
  const { data: songs } = api.spotify.searchSongs.useQuery(
    { query: value },
    { keepPreviousData: true },
  );

  const message = useMemo(() => {
    const content = isLoading ? 'loading...' : theme?.content;
    if (isError) return 'Oops, something went wrong 💀';
    return (
      <>
        {"Today's theme is"} <span className="text-teal-400">{content}</span>
      </>
    );
  }, [theme, isError, isLoading]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(value);
  };

  return (
    <section className="sticky top-0 z-50 bg-gradient-to-b from-black from-40% to-transparent p-4">
      <header className="flex flex-col items-center gap-4">
        <h2 className="text-center text-3xl">{message}</h2>
        <form
          onSubmit={handleSubmit}
          className="z-50 flex w-1/2 min-w-2xs rounded-lg border border-neutral-50 transition-colors focus-within:border-teal-400 focus-within:bg-black hover:border-teal-400 hover:bg-black"
        >
          <input
            name="song"
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent p-2 text-neutral-50 outline-none transition-all focus:border-teal-400"
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="p-2 text-xl transition-colors hover:text-teal-400">
            <IoPlay />
          </button>
        </form>
      </header>
      {focus && songs?.length ? (
        <div className="relative flex w-full justify-center">
          <div className="absolute top-0"></div>
          <ul className="absolute top-0 z-10 flex w-1/2 min-w-2xs flex-col rounded-lg bg-black p-4 outline outline-1 outline-teal-400">
            {songs.map((song) => (
              <li key={song.id}>{song.name}</li>
            ))}
          </ul>
        </div>
      ) : null}
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
