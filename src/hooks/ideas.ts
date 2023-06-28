import { useState } from 'react';

type IdeasCategory = 'liked' | 'latest';

export const useIdeasCategory = () => {
  const [category, setCategory] = useState<IdeasCategory>('liked');

  const liked = category === 'liked';
  const latest = category === 'latest';
  const setLiked = () => setCategory('liked');
  const setLatest = () => setCategory('latest');

  return {
    category,
    liked,
    latest,
    setLiked,
    setLatest,
    setCategory,
  };
};
