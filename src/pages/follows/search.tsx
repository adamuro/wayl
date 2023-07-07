import { useAuth } from '@clerk/nextjs';
import { type User } from '@prisma/client';
import Image from 'next/image';
import { useCallback, useMemo } from 'react';
import { MdPersonAddAlt1, MdPersonRemoveAlt1 } from 'react-icons/md';
import { LoadingSpinner } from '~/components/loading';
import { api, type RouterOutputs } from '~/utils/api';

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

interface UserSearchResultProps {
  user: RouterOutputs['users']['getByName'][number];
  onSuccess: (data: User, variables: { id: string }, context: unknown) => unknown;
}

export const UserSearchResult = ({ user, onSuccess }: UserSearchResultProps) => {
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
