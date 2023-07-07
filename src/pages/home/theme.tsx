import { If } from '~/components/condition';
import { api } from '~/utils/api';

export const ThemeText = () => {
  const theme = api.themes.getActive.useQuery();

  return (
    <h2 className="text-center text-3xl [text-wrap:balance]">
      <If cond={theme.isError}>{'Oops, something went wrong 💀'}</If>
      <If cond={!theme.isError}>
        {"Today's theme is "}
        <span className="text-teal-400">
          {theme.isLoading ? (
            <span className="animate-pulse">loading...</span>
          ) : (
            theme.data?.content
          )}
        </span>
      </If>
    </h2>
  );
};
