import type { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { If } from '~/components/condition';
import { SearchResultsSkeleton } from '~/components/skeleton';
import { api } from '~/utils/api';

const Friends: NextPage = () => {
  const [name, setName] = useState('');
  const [focus, setFocus] = useState(false);

  const users = api.users.current.getNotFollowedByName.useQuery(
    { name },
    { keepPreviousData: true },
  );

  return (
    <section className="sticky top-0 z-50 border-b border-neutral-700 bg-black p-4">
      <header className="flex flex-col items-center gap-6">
        <h2 className="text-center text-3xl">Friends</h2>
        <form
          // onSubmit={handleSubmit}
          className="flex w-1/2 min-w-2xs rounded-lg border border-neutral-50 bg-black transition-colors focus-within:border-teal-400 hover:border-teal-400"
        >
          <input
            type="text"
            autoComplete="off"
            placeholder="Search..."
            value={name}
            required
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent p-2 text-neutral-50 outline-none transition-all focus:border-teal-400"
          />
        </form>
      </header>
      <If cond={focus && name}>
        <div className="relative flex w-full justify-center">
          <div className="absolute top-0"></div>
          <If cond={!users.data?.length}>
            <If cond={users.isFetching}>
              <SearchResultsSkeleton />
            </If>
            <If cond={!users.isFetching}>
              <ul className="absolute top-0 flex max-h-64 w-1/2 min-w-2xs flex-col overflow-y-scroll rounded-lg bg-black outline outline-1 outline-teal-400">
                <li className="flex cursor-pointer flex-col break-words px-4 py-2 transition-colors hover:bg-neutral-900 hover:text-teal-400">
                  No results
                </li>
              </ul>
            </If>
          </If>
          <If cond={users.data?.length}>
            <ul className="absolute top-0 flex max-h-64 w-1/2 min-w-2xs flex-col overflow-y-scroll rounded-lg bg-black outline outline-1 outline-teal-400">
              {users.data?.map((user) => (
                <li
                  key={user.id}
                  // onMouseDown={() => handleSelectSong(song)}
                  className="flex items-center gap-4 py-2 pl-4 transition-colors hover:bg-neutral-900 hover:text-teal-400"
                >
                  <Image
                    alt={`${user.name} profile picture`}
                    src={user.avatarUrl}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col break-words">
                      <span className="leading-5">{user.name}</span>
                      <span className="break-words text-xs text-neutral-50">
                        TODO: Friends who also follow
                      </span>
                    </div>
                    <button
                      // disabled={!song.preview_url}
                      // title={audio.playing && audio.current === song.id ? 'Pause' : 'Play'}
                      // onMouseDown={(e) => handlePreviewSong(e, song)}
                      className="p-2 text-neutral-50 transition-colors hover:text-teal-400"
                    >
                      {/* <If cond={audio.paused || audio.current !== song.id}>
                    <IoPlay className="text-xl" />
                  </If>
                  <If cond={audio.playing && audio.current === song.id}>
                    <IoPause className="text-xl" />
                  </If> */}
                      Follow
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </If>
        </div>
      </If>
    </section>
  );
};

export default Friends;
