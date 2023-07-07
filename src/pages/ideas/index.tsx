import { useAuth } from '@clerk/nextjs';
import { type Idea } from '@prisma/client';
import type { NextPage } from 'next';
import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { IoPlay } from 'react-icons/io5';
import { LoadingSpinner } from '~/components/loading';
import { IdeaSearchResultsSkeleton } from '~/components/skeleton';
import { useIdeasCategory } from '~/hooks/ideas';
import { api, type RouterOutputs } from '~/utils/api';

import { PiHeart, PiHeartFill } from 'react-icons/pi';

type FeedIdea =
  | RouterOutputs['ideas']['getLiked'][number]
  | RouterOutputs['ideas']['getLatest'][number];

interface LikeIconProps {
  liked: boolean;
  hover: boolean;
}

export const LikeIcon = ({ liked, hover }: LikeIconProps) => {
  return liked ? (
    <PiHeartFill className="text-teal-400 transition-colors group-hover:text-neutral-50" />
  ) : hover ? (
    <PiHeartFill className="text-teal-400" />
  ) : (
    <PiHeart className="text-neutral-50" />
  );
};

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

const Ideas: NextPage = () => {
  const category = useIdeasCategory();
  const [idea, setIdea] = useState('');
  const createIdea = api.ideas.create.useMutation({
    onSuccess: async () => {
      setIdea('');
      await refetchIdeas();
    },
  });
  const likedIdeas = api.ideas.getLiked.useQuery();
  const latestIdeas = api.ideas.getLatest.useQuery();
  const ideas = category.liked ? likedIdeas : latestIdeas;

  const refetchIdeas = async () => {
    await Promise.all([likedIdeas.refetch(), latestIdeas.refetch()]);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!idea) return;
    createIdea.mutate({ content: idea });
  };

  return (
    <>
      <section className="sticky top-0 z-50 border-b border-neutral-700 bg-black">
        <header className="flex flex-col items-center gap-6 px-4 pt-4">
          <h2 className="text-center text-3xl">
            Theme <span className="text-teal-400">ideas</span>
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex w-1/2 min-w-2xs rounded-lg border border-neutral-50 bg-black transition-colors focus-within:border-teal-400 hover:border-teal-400"
          >
            <input
              type="text"
              title=""
              autoComplete="off"
              placeholder="Your idea..."
              value={idea}
              required
              onChange={(e) => setIdea(e.target.value)}
              className="w-full bg-transparent p-2 text-neutral-50 outline-none transition-all focus:border-teal-400"
            />
            <button
              disabled={!idea}
              title={idea ? 'Post!' : 'Choose a song'}
              className="p-2 pr-3 text-xl transition-colors hover:text-teal-400 disabled:text-neutral-700"
            >
              {createIdea.isLoading ? <LoadingSpinner /> : <IoPlay />}
            </button>
          </form>
        </header>
        <div className="flex w-full pt-8">
          <button
            onClick={category.setLiked}
            data-checked={category.liked}
            className="w-full p-2 text-lg  transition-colors hover:bg-neutral-900 data-[checked=true]:text-teal-400"
          >
            Liked
          </button>
          <button
            onClick={category.setLatest}
            data-checked={category.latest}
            className="w-full p-2 text-lg transition-colors hover:bg-neutral-900  data-[checked=true]:text-teal-400"
          >
            Latest
          </button>
        </div>
      </section>
      <section>
        <ul>
          {ideas.data ? (
            ideas.data.map((idea) => (
              <FeedIdea key={idea.id} idea={idea} onSuccess={refetchIdeas} />
            ))
          ) : (
            <IdeaSearchResultsSkeleton />
          )}
        </ul>
      </section>
    </>
  );
};

export default Ideas;
