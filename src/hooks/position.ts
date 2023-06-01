import { type RefObject, useCallback, useEffect, useState } from 'react';

const initialPosition = { x: 0, y: 0 };

export const useRefPosition = (ref: RefObject<HTMLLIElement>) => {
  const [position, setPosition] = useState(initialPosition);

  const updatePosition = useCallback(() => {
    const rect = ref.current?.getBoundingClientRect();
    setPosition({
      x: rect?.x || 0,
      y: rect?.y || 0,
    });
  }, [ref]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  return { position, updatePosition };
};
