import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { IoPlay } from 'react-icons/io5';
import { api } from '~/utils/api';

const Theme = () => {
  const { data: theme, isError, isLoading } = api.themes.getActive.useQuery();

  const [focus, setFocus] = useState(false);
  const message = useMemo(() => {
    const content = isLoading ? 'loading...' : theme?.content;
    if (isError) return 'Oops, something went wrong 💀';
    return (
      <>
        {"Today's theme is"} <span className="text-teal-400">{content}</span>
      </>
    );
  }, [theme, isError, isLoading]);

  return (
    <section className="sticky top-0 z-50 flex flex-col items-center gap-4 bg-gradient-to-b from-black from-40% to-transparent p-4">
      <h2 className="text-center text-3xl">{message}</h2>
      <form className="flex max-w-2xs justify-center rounded-lg border border-teal-400 transition-all hover:bg-black">
        <input
          type="text"
          placeholder="Search"
          className="w-full max-w-2xs rounded-l-lg bg-transparent p-2 text-neutral-50 outline-none focus:bg-black"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        <button
          type="button"
          className={`rounded-r-lg bg-transparent text-3xl ${focus ? 'bg-black' : ''}`}
        >
          <IoPlay className="text-neutral-50 transition-colors hover:text-teal-400" />
        </button>
      </form>
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
