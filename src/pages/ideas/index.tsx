import { useAuth } from '@clerk/nextjs';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import type { NextPage } from 'next';
import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { IoMdTrash } from 'react-icons/io';
import { IoCheckmark, IoPlay } from 'react-icons/io5';
import { Avatar } from '~/components/avatar';
import { If } from '~/components/condition';
import { LikeIcon } from '~/components/like';
import { LoadingSpinner } from '~/components/loading';
import { IdeaSearchResultsSkeleton } from '~/components/skeleton';
import { useIdeasCategory } from '~/hooks/ideas';
import { useScroll } from '~/hooks/scroll';
import { api, type RouterOutputs } from '~/utils/api';

type FeedIdea =
  | RouterOutputs['ideas']['getLiked'][number]
  | RouterOutputs['ideas']['getLatest'][number];

interface FeedIdeaProps {
  idea: FeedIdea;
}

export const FeedIdea = ({ idea }: FeedIdeaProps) => {
  const { userId } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const trpc = api.useContext();
  const user = api.users.current.get.useQuery();
  const anchorId = `${idea.authorId}-${idea.id}-anchor`;

  const accept = api.ideas.accept.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: async () => {
      toast.success('Idea accepted!');
      await trpc.ideas.invalidate();
    },
  });

  const remove = api.ideas.remove.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: async () => {
      toast.success('Idea deleted!');
      await trpc.ideas.invalidate();
    },
  });

  const like = api.ideas.like.useMutation({
    onError: (error) => toast.error(error.message || 'Something went wrong 💀'),
    onSettled: () => {
      return Promise.all([trpc.ideas.getLiked.invalidate(), trpc.ideas.getLatest.invalidate()]);
    },
    onMutate: async () => {
      if (!userId) return;

      await Promise.all([trpc.ideas.getLatest.cancel(), trpc.ideas.getLiked.cancel()]);
      [trpc.ideas.getLiked, trpc.ideas.getLatest].forEach((query) => {
        query.setData(undefined, (ideas) => {
          const prevIdea = ideas?.find(({ id }) => id === idea.id);
          if (!prevIdea || !ideas) return ideas;

          return ideas.map((prev) =>
            prev.id === idea.id ? { ...prev, upvoters: [...prev.upvoters, { id: userId }] } : prev,
          );
        });
      });
    },
  });

  const unlike = api.ideas.unlike.useMutation({
    onError: (error) => toast.error(error.message || 'Something went wrong 💀'),
    onSettled: () => {
      return Promise.all([trpc.ideas.getLiked.invalidate(), trpc.ideas.getLatest.invalidate()]);
    },
    onMutate: async () => {
      if (!userId) return;

      await Promise.all([trpc.ideas.getLatest.cancel(), trpc.ideas.getLiked.cancel()]);
      [trpc.ideas.getLiked, trpc.ideas.getLatest].forEach((query) => {
        query.setData(undefined, (ideas) => {
          const prevIdea = ideas?.find(({ id }) => id === idea.id);
          if (!prevIdea || !ideas) return ideas;

          return ideas.map((prev) =>
            prev.id === idea.id
              ? { ...prev, upvoters: prev.upvoters.filter(({ id }) => id !== userId) }
              : prev,
          );
        });
      });
    },
  });

  const isLiked = useMemo(
    () => userId && idea.upvoters.some(({ id }) => id === userId),
    [idea, userId],
  );

  const handleLike = useCallback(() => {
    setIsHovered(false);
    const toggleLike = isLiked ? unlike : like;
    toggleLike.mutate({ id: idea.id });
  }, [idea, isLiked, like, unlike]);

  const handleAccept = () => accept.mutate({ id: idea.id, content: idea.content });
  const handleRemove = () => remove.mutate({ id: idea.id });

  return (
    <li className="group flex items-center justify-between hover:bg-neutral-900">
      <div className="flex items-center gap-4 py-4 pl-4">
        <Avatar
          id={idea.authorId}
          anchorId={anchorId}
          name={idea.author.name}
          url={idea.author.avatarUrl}
        />
        <div className="flex flex-col break-words">
          <span className="font-semibold leading-5 transition-colors group-hover:text-teal-400">
            {idea.content}
          </span>
          <span className="break-words text-xs text-neutral-50">
            {formatDistanceToNowStrict(idea.createdAt)} ago
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 p-4">
        <span>{idea.upvoters.length}</span>
        <button
          onClick={handleLike}
          title={isLiked ? 'Unlike' : 'Like'}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          className="group/like flex items-center rounded-lg p-2 text-2xl transition-colors hover:bg-black"
        >
          <LikeIcon isLiked={isLiked} isHovered={isHovered} />
        </button>
        <If cond={user.data?.roles.includes('ADMIN')}>
          <button
            onClick={handleAccept}
            disabled={accept.isLoading}
            title={'Accept'}
            className="group/accept flex items-center rounded-lg p-2 text-2xl transition-colors hover:bg-black"
          >
            {accept.isLoading ? (
              <LoadingSpinner className="p-0.5" />
            ) : (
              <IoCheckmark className="group-hover/accept:text-teal-400" />
            )}
          </button>
          <button
            onClick={handleRemove}
            disabled={remove.isLoading}
            title={'Remove'}
            className="group/remove flex items-center rounded-lg p-2 text-2xl transition-colors hover:bg-black"
          >
            {remove.isLoading ? (
              <LoadingSpinner className="p-0.5" />
            ) : (
              <IoMdTrash className="group-hover/remove:text-teal-400" />
            )}
          </button>
        </If>
      </div>
    </li>
  );
};

const Ideas: NextPage = () => {
  const [idea, setIdea] = useState('');
  const scroll = useScroll();
  const category = useIdeasCategory({ onSet: () => scroll.toTop() });
  const likedIdeas = api.ideas.getLiked.useQuery();
  const latestIdeas = api.ideas.getLatest.useQuery();
  const ideas = category.liked ? likedIdeas : latestIdeas;
  const createIdea = api.ideas.create.useMutation({
    onSuccess: async () => {
      setIdea('');
      toast.success('Cool idea!');
      await Promise.all([likedIdeas.refetch(), latestIdeas.refetch()]);
    },
    onError: (error) => toast.error(error.message || 'Something went wrong 💀'),
  });

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
      <section className="h-full">
        <ul>
          {ideas.data ? (
            ideas.data.map((idea) => <FeedIdea key={idea.id} idea={idea} />)
          ) : (
            <IdeaSearchResultsSkeleton />
          )}
        </ul>
      </section>
    </>
  );
};

export default Ideas;
