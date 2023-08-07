import { useAuth } from '@clerk/nextjs';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { MdPersonAddAlt1, MdPersonRemoveAlt1 } from 'react-icons/md';
import { Tooltip, type PlacesType } from 'react-tooltip';
import { api } from '~/utils/api';

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

interface UserTooltipProps {
  id: string;
  anchorId: string;
  name: string;
  place?: PlacesType;
  offset?: number;
}

export const UserTooltip = (props: UserTooltipProps) => {
  const { userId } = useAuth();
  const trpc = api.useContext();
  const followers = api.users.getFollowersById.useQuery({ id: props.id });

  const followed = useMemo(
    () => userId && followers.data?.some(({ id }) => id === userId),
    [userId, followers],
  );

  const follow = api.users.current.follow.useMutation({
    onSuccess: () => trpc.users.invalidate(),
    onSettled: () => trpc.users.getFollowersById.invalidate(),
    onError: (error) => toast.error(error.message || 'Something went wrong 💀'),
    onMutate: async () => {
      if (!userId) return;

      await trpc.users.getFollowersById.cancel();
      trpc.users.getFollowersById.setData({ id: props.id }, (followers) => {
        if (!followers) return followers;
        return [...followers, { id: userId }];
      });
    },
  });

  const unfollow = api.users.current.unfollow.useMutation({
    onSuccess: () => trpc.users.invalidate(),
    onSettled: () => trpc.users.getFollowersById.invalidate(),
    onError: (error) => toast.error(error.message || 'Something went wrong 💀'),
    onMutate: async () => {
      if (!userId) return;

      await trpc.users.getFollowersById.cancel();
      trpc.users.getFollowersById.setData({ id: props.id }, (followers) => {
        if (!followers) return followers;
        return followers.filter(({ id }) => id !== userId);
      });
    },
  });

  const handleFollow = useCallback(() => {
    const toggleFollow = followed ? unfollow : follow;
    toggleFollow.mutate({ id: props.id });
  }, [props.id, followed, follow, unfollow]);

  return (
    <Tooltip
      anchorSelect={`#${props.anchorId}`}
      place={props.place || 'right'}
      opacity={1}
      delayShow={300}
      delayHide={200}
      offset={props.offset ?? 10}
      noArrow
      clickable
      style={{ backgroundColor: 'black', borderRadius: '0.5rem', zIndex: 100 }}
      className="border border-teal-400"
    >
      <div className="z-50 flex w-full items-center gap-4">
        <div className="flex flex-col break-words">
          <span className="font-semibold leading-5 text-teal-400">{props.name}</span>
          <span className="break-words text-xs">
            {followers.data ? formatter.format(followers.data.length) : ''}
            {followers.data?.length === 1 ? ' follower' : ' followers'}
          </span>
        </div>
        <button
          onClick={handleFollow}
          title={followed ? 'Unfollow' : 'Follow'}
          className="rounded-lg p-2 text-2xl text-neutral-50 transition-colors hover:bg-neutral-900 hover:text-teal-400"
        >
          {followed ? <MdPersonRemoveAlt1 /> : <MdPersonAddAlt1 />}
        </button>
      </div>
    </Tooltip>
  );
};
