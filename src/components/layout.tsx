import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { useWindowWidth } from '~/hooks/useWindowWidth';

export const PageLayout = (props: PropsWithChildren) => {
  const width = useWindowWidth();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex w-full max-w-4xl flex-row">
        <nav className="sticky top-0 h-screen flex-1 items-start justify-start border-r border-slate-50">
          <ul className="flex flex-col gap-1 p-2 text-lg">
            <li className="rounded-lg p-2 transition-all hover:bg-neutral-900">
              <UserButton
                showName={width > 900}
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonOuterIdentifier: 'font-sans font-medium text-lg cl-userButtonTrigger',
                    userButtonBox: 'flex-row-reverse gap-3 hover:bg',
                    userButtonPopoverCard: { left: '0.5rem !important', borderRadius: '0.5rem' },
                  },
                }}
              />
            </li>
            <Link href="/">
              <li className="rounded-lg p-2 transition-all hover:bg-neutral-900">Home</li>
            </Link>
            <Link href="/profile">
              <li className="rounded-lg p-2 transition-all hover:bg-neutral-900">Profile</li>
            </Link>
            <Link href="/ideas">
              <li className="rounded-lg p-2 transition-all hover:bg-neutral-900">Ideas</li>
            </Link>
          </ul>
        </nav>
        <div className="flex-grow-[3] flex-col">{props.children}</div>
      </div>
    </div>
  );
};
