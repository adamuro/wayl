import { useState } from 'react';

type IdeasCategory = 'liked' | 'latest';
interface UseIdeasCategoryOptions {
  onSet?: () => void;
}

export const useIdeasCategory = (options?: UseIdeasCategoryOptions) => {
  const [category, setCategory] = useState<IdeasCategory>('liked');

  const liked = category === 'liked';
  const latest = category === 'latest';
  const setLiked = () => {
    setCategory('liked');
    options?.onSet?.();
  };
  const setLatest = () => {
    setCategory('latest');
    options?.onSet?.();
  };

  return {
    category,
    liked,
    latest,
    setLiked,
    setLatest,
    setCategory,
  };
};
