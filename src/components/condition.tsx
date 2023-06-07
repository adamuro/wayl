import { type PropsWithChildren } from 'react';

export interface IfProps extends PropsWithChildren {
  cond: unknown;
}

export const If = (props: IfProps) => {
  return <>{props.cond ? props.children : null}</>;
};
