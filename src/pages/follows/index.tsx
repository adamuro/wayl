import type { NextPage } from 'next';
import { useState } from 'react';
import { UserSearchResultsSkeleton } from '~/components/skeleton';
import { api } from '~/utils/api';
import { UserSearchResult } from './search';

const Follows: NextPage = () => {
  const [name, setName] = useState('');
  const users = api.users.getByName.useQuery({ name }, { keepPreviousData: true });

  return (
    <>
      <section className="sticky top-0 z-50 border-b border-neutral-700 bg-black p-4">
        <header className="flex flex-col items-center gap-6">
          <h2 className="text-center text-3xl">
            Users you <span className="text-teal-400">follow</span>
          </h2>
          <form className="flex w-1/2 min-w-2xs rounded-lg border border-neutral-50 bg-black transition-colors focus-within:border-teal-400 hover:border-teal-400">
            <input
              type="text"
              title=""
              autoComplete="off"
              placeholder="Find your friends..."
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent p-2 text-neutral-50 outline-none transition-all focus:border-teal-400"
            />
          </form>
        </header>
      </section>
      <section>
        <ul>
          {users.data?.length ? (
            users.data?.map((user) => (
              <UserSearchResult key={user.id} user={user} onSuccess={() => users.refetch()} />
            ))
          ) : users.isFetching ? (
            <UserSearchResultsSkeleton />
          ) : (
            <li className="flex items-center justify-center p-4 text-xl">No results</li>
          )}
        </ul>
      </section>
    </>
  );
};

export default Follows;
