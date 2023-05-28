import type { PropsWithChildren } from 'react';
import { useDevice } from '~/hooks/device';

export const Mobile = (props: PropsWithChildren) => {
  const device = useDevice();

  return <>{device === 'mobile' ? props.children : null}</>;
};

export const Desktop = (props: PropsWithChildren) => {
  const device = useDevice();

  return <>{device === 'desktop' ? props.children : null}</>;
};
