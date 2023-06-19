interface SearchResultsSkeletonProps {
  length?: number;
}

const DEFAULT_LENGTH = 10;

export const SearchResultsSkeleton = (props: SearchResultsSkeletonProps) => {
  return (
    <ul className="absolute top-0 flex h-64 w-1/2 min-w-2xs flex-col overflow-y-scroll rounded-lg bg-black outline outline-1 outline-teal-400">
      {[...Array.from(Array(props.length || DEFAULT_LENGTH).keys())].map((i) => {
        return (
          <li
            key={i}
            className="flex animate-pulse cursor-pointer items-center gap-4 px-4 pb-2 pt-4 transition-colors hover:bg-neutral-900"
          >
            <div className="h-9 w-9 rounded-full bg-neutral-700"></div>
            <div className="flex flex-col justify-between gap-2">
              <div className="h-3 w-40 rounded-full bg-neutral-700"></div>
              <div className="h-2 w-16 rounded-full bg-neutral-700"></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
