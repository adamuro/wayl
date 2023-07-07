import { useAuth } from '@clerk/nextjs';
import { type Idea } from '@prisma/client';
import { useCallback, useMemo, useState } from 'react';
import { LoadingSpinner } from '~/components/loading';
import { api, type RouterOutputs } from '~/utils/api';
import { LikeIcon } from './like';

type FeedIdea =
  | RouterOutputs['ideas']['getLiked'][number]
  | RouterOutputs['ideas']['getLatest'][number];
interface FeedIdeaProps {
  idea: FeedIdea;
  onSuccess: (data: Idea, variables: { id: number }, context: unknown) => unknown;
}

export const FeedIdea = ({ idea, onSuccess }: FeedIdeaProps) => {
  const { userId } = useAuth();
  const [hover, setHover] = useState(false);
  const like = api.ideas.like.useMutation({ onSuccess });
  const unlike = api.ideas.unlike.useMutation({ onSuccess });

  const liked = useMemo(
    () => userId && idea.upvoters.some(({ id }) => id === userId),
    [idea, userId],
  );

  const actionsLoading = useMemo(
    () => like.isLoading || unlike.isLoading,
    [like.isLoading, unlike.isLoading],
  );

  const action = useCallback(() => {
    setHover(false);

    if (liked) return unlike.mutate({ id: idea.id });
    like.mutate({ id: idea.id });
  }, [liked, like, unlike, idea]);

  return (
    <li key={idea.id} className="flex items-center justify-between p-4 hover:bg-neutral-900">
      <span className="first-letter:uppercase">{idea.content}</span>
      <div className="flex items-center gap-2">
        <span>{idea.upvoters.length}</span>
        <button
          onClick={action}
          disabled={actionsLoading}
          title={actionsLoading ? '' : liked ? 'Unlike' : 'Like'}
          onMouseOver={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          className="group flex items-center rounded-lg p-2 text-2xl transition-colors hover:bg-black"
        >
          {actionsLoading ? (
            <LoadingSpinner className="p-0.5" />
          ) : (
            <LikeIcon liked={Boolean(liked)} hover={hover} />
          )}
        </button>
      </div>
    </li>
  );
};
