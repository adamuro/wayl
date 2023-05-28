import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';

export interface PathIsProps extends PropsWithChildren {
  is: string;
}
export function isPathIsProps(props: PathProps): props is PathIsProps {
  return 'is' in props;
}

export interface PathNotProps extends PropsWithChildren {
  not: string;
}
export function isPathNotProps(props: PathProps): props is PathNotProps {
  return 'not' in props;
}

export type PathProps = PathIsProps | PathNotProps;

export const Path = (props: PathProps) => {
  const { pathname } = useRouter();

  if (isPathIsProps(props)) return <>{pathname === props.is ? props.children : null}</>;
  if (isPathNotProps(props)) return <>{pathname !== props.not ? props.children : null}</>;
  throw new TypeError('Either "is" or "not" prop must be passed to Path component.');
};
