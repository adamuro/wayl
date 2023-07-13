const DEFAULT_BEHAVIOR = 'smooth';

export const useScroll = () => {
  const toTop = (options?: ScrollOptions) => {
    window.scrollTo({ left: 0, top: 0, behavior: options?.behavior || DEFAULT_BEHAVIOR });
  };

  return { toTop };
};
