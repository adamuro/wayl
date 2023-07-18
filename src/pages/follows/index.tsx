import { useAuth } from '@clerk/nextjs';
import { type User } from '@prisma/client';
import type { NextPage } from 'next';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdPersonAddAlt1, MdPersonRemoveAlt1 } from 'react-icons/md';
import { Avatar } from '~/components/avatar';
import { UserSearchResultsSkeleton } from '~/components/skeleton';
import { api, type RouterOutputs } from '~/utils/api';

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

interface UserSearchResultProps {
  user: RouterOutputs['users']['getByName'][number];
  query: string;
  onSuccess: (data: User, variables: { id: string }, context: unknown) => unknown;
}

const UserSearchResult = ({ user, query, onSuccess }: UserSearchResultProps) => {
  const trpc = api.useContext();
  const { userId } = useAuth();

  const follow = api.users.current.follow.useMutation({
    onSuccess,
    onSettled: () => trpc.users.getByName.invalidate(),
    onError: (error) => toast.error(error.message || 'Something went wrong 💀'),
    onMutate: async () => {
      if (!userId) return;

      await trpc.users.getByName.cancel();
      trpc.users.getByName.setData({ name: query }, (users) => {
        const prevUser = users?.find(({ id }) => id === user.id);
        if (!prevUser || !users) return users;

        return users.map((prev) =>
          prev.id === user.id ? { ...prev, followers: [...prev.followers, { id: userId }] } : prev,
        );
      });
    },
  });

  const unfollow = api.users.current.unfollow.useMutation({
    onSuccess,
    onSettled: () => trpc.users.getByName.invalidate(),
    onError: (error) => toast.error(error.message || 'Something went wrong 💀'),
    onMutate: async () => {
      if (!userId) return;

      await trpc.users.getByName.cancel();
      trpc.users.getByName.setData({ name: query }, (users) => {
        if (!query) return users?.filter(({ id }) => id !== user.id);

        const prevUser = users?.find(({ id }) => id === user.id);
        if (!prevUser || !users) return users;

        return users.map((prev) =>
          prev.id === user.id
            ? { ...prev, followers: prev.followers.filter(({ id }) => id !== userId) }
            : prev,
        );
      });
    },
  });

  const followed = useMemo(
    () => userId && user.followers.some(({ id }) => id === userId),
    [userId, user],
  );

  const handleFollow = useCallback(() => {
    const toggleFollow = followed ? unfollow : follow;
    toggleFollow.mutate({ id: user.id });
  }, [user, followed, follow, unfollow]);

  return (
    <li className="flex items-center gap-4 p-4 transition-colors hover:bg-neutral-900 hover:text-teal-400">
      <Avatar name={user.name} url={user.avatarUrl} />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col break-words">
          <span className="font-semibold leading-5">{user.name}</span>
          <span className="break-words text-xs text-neutral-50">
            {formatter.format(user.followers.length)}
            {user.followers.length === 1 ? ' follower' : ' followers'}
          </span>
        </div>
        <button
          onClick={handleFollow}
          title={followed ? 'Unfollow' : 'Follow'}
          className="rounded-lg p-2 text-2xl text-neutral-50 transition-colors hover:bg-black hover:text-teal-400"
        >
          {followed ? <MdPersonRemoveAlt1 /> : <MdPersonAddAlt1 />}
        </button>
      </div>
    </li>
  );
};

const Follows: NextPage = () => {
  const [name, setName] = useState('');
  const users = api.users.getByName.useQuery({ name });

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
              <UserSearchResult
                key={user.id}
                user={user}
                query={name}
                onSuccess={() => users.refetch()}
              />
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
