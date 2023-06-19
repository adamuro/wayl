import type { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { If } from '~/components/condition';
import { UserSearchResultsSkeleton } from '~/components/skeleton';
import { api } from '~/utils/api';

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

const Follows: NextPage = () => {
  const [name, setName] = useState('');
  const currentUser = api.users.current.get.useQuery();
  const users = api.users.getByName.useQuery({ name }, { keepPreviousData: true });

  return (
    <>
      <section className="sticky top-0 z-50 border-b border-neutral-700 bg-black p-4">
        <header className="flex flex-col items-center gap-6">
          <h2 className="text-center text-3xl">
            Users you <span className="text-teal-400">follow</span>
          </h2>
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
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent p-2 text-neutral-50 outline-none transition-all focus:border-teal-400"
            />
          </form>
        </header>
      </section>
      <section>
        <If cond={!users.data?.length}>
          <If cond={users.isFetching}>
            <UserSearchResultsSkeleton />
          </If>
          <If cond={!users.isFetching}>
            <ul>
              <li className="flex items-center justify-center p-4 text-xl">No results</li>
            </ul>
          </If>
        </If>
        <If cond={users.data?.length}>
          <ul>
            {users.data?.map((user) => (
              <li
                key={user.id}
                // onMouseDown={() => handleSelectSong(song)}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-neutral-900 hover:text-teal-400"
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
                      {formatter.format(user.followers.length)}
                      {user.followers.length === 1 ? ' follower' : ' followers'}
                    </span>
                  </div>
                  {/* <If cond={audio.paused || audio.current !== song.id}>
                    <IoPlay className="text-xl" />
                    </If>
                    <If cond={audio.playing && audio.current === song.id}>
                    <IoPause className="text-xl" />
                  </If> */}
                  {currentUser.data?.id &&
                  user.followers.some(({ id }) => id === currentUser.data?.id) ? (
                    <button
                      // onMouseDown={(e) => handlePreviewSong(e, song)}
                      className="rounded-full border border-teal-400 bg-black px-4 py-2 text-neutral-50 transition-colors hover:bg-neutral-900 hover:text-teal-400"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      // onMouseDown={(e) => handlePreviewSong(e, song)}
                      className="rounded-full border border-teal-400 bg-neutral-900 px-4 py-2 text-neutral-50 transition-colors hover:bg-black hover:text-teal-400"
                    >
                      Follow
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </If>
      </section>
    </>
  );
};

export default Follows;
