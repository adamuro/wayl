import type { RefObject } from 'react';

export const useElementPosition = (ref: RefObject<HTMLLIElement>) => {
  const rect = ref.current?.getBoundingClientRect();
  return {
    x: rect?.x || 0,
    y: rect?.y || 0,
  };
};
