import { type ClassValue } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import LogoImage from '~/assets/logo.png';
import { cn } from '~/utils/cn';

const DEFAULT_SIZE = 30;

interface LogoProps {
  size?: number;
  className?: ClassValue;
}

export const Logo = (props: LogoProps) => {
  return (
    <Link href={'/'} className={cn('flex cursor-pointer', props.className)}>
      <Image
        alt="Wayl logo"
        src={LogoImage}
        width={props.size || DEFAULT_SIZE}
        height={props.size || DEFAULT_SIZE}
      />
    </Link>
  );
};
