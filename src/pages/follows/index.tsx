import { useAuth } from '@clerk/nextjs';
import { type User } from '@prisma/client';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { MdPersonAddAlt1, MdPersonRemoveAlt1 } from 'react-icons/md';
import { LoadingSpinner } from '~/components/loading';
import { UserSearchResultsSkeleton } from '~/components/skeleton';
import { api, type RouterOutputs } from '~/utils/api';

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

interface UserSearchResultProps {
  user: RouterOutputs['users']['getByName'][number];
  onSuccess: (data: User, variables: { id: string }, context: unknown) => unknown;
}

const UserSearchResult = ({ user, onSuccess }: UserSearchResultProps) => {
  const { userId } = useAuth();
  const follow = api.users.current.follow.useMutation({ onSuccess });
  const unfollow = api.users.current.unfollow.useMutation({ onSuccess });

  const followed = useMemo(
    () => userId && user.followers.some(({ id }) => id === userId),
    [userId, user],
  );

  const actionsLoading = useMemo(
    () => follow.isLoading || unfollow.isLoading,
    [follow.isLoading, unfollow.isLoading],
  );

  const action = useCallback(
    () => (followed ? unfollow.mutate({ id: user.id }) : follow.mutate({ id: user.id })),
    [followed, follow, unfollow, user],
  );

  return (
    <li className="flex items-center gap-4 p-4 transition-colors hover:bg-neutral-900 hover:text-teal-400">
      <div>
        <div className="w-9">
          <Image
            alt={`${user.name} profile picture`}
            src={user.avatarUrl}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col break-words">
          <span className="font-semibold leading-5">{user.name}</span>
          <span className="break-words text-xs text-neutral-50">
            {formatter.format(user.followers.length)}
            {user.followers.length === 1 ? ' follower' : ' followers'}
          </span>
        </div>
        <button
          onClick={action}
          disabled={actionsLoading}
          title={actionsLoading ? '' : followed ? 'Unfollow' : 'Follow'}
          className="rounded-lg p-2 text-2xl text-neutral-50 transition-colors hover:bg-black hover:text-teal-400"
        >
          {actionsLoading ? (
            <LoadingSpinner className="p-0.5" />
          ) : followed && userId ? (
            <MdPersonRemoveAlt1 />
          ) : (
            <MdPersonAddAlt1 />
          )}
        </button>
      </div>
    </li>
  );
};

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
