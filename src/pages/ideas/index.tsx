import type { NextPage } from 'next';
import { useState, type FormEvent } from 'react';
import { IoPlay } from 'react-icons/io5';
import { LoadingSpinner } from '~/components/loading';
import { IdeaSearchResultsSkeleton } from '~/components/skeleton';
import { useIdeasCategory } from '~/hooks/ideas';
import { api } from '~/utils/api';
import { FeedIdea } from './feed';

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
