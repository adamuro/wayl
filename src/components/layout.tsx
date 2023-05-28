import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { useCallback, useRef, useState } from 'react';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { FaLightbulb, FaRegLightbulb } from 'react-icons/fa';
import { useDevice } from '~/hooks/device';
import { Desktop } from './device';
import { Path } from './path';

const Navigation = () => {
  const device = useDevice();

  const [userButtonX, setUserButtonX] = useState(0);
  const userButtonRef = useRef<HTMLLIElement>(null);
  const handleUserButtonHover = useCallback(() => {
    const rect = userButtonRef.current?.getBoundingClientRect();
    setUserButtonX(rect?.x || 0);
  }, [userButtonRef]);

  return (
    <nav className="sticky top-0 h-screen flex-auto items-start justify-start border-r border-slate-50 mobile:flex-grow-0 desktop:w-1">
      <ul className="flex flex-col gap-1 p-2 text-xl">
        <li
          ref={userButtonRef}
          onPointerEnter={handleUserButtonHover}
          className="rounded-lg p-2 transition-all hover:bg-neutral-900"
        >
          <UserButton
            showName={device === 'desktop'}
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: { width: '30px', height: '30px' },
                userButtonOuterIdentifier: 'font-sans font-medium text-xl cl-userButtonTrigger',
                userButtonBox: 'flex-row-reverse gap-3 hover:bg',
                userButtonPopoverCard: {
                  left: `${userButtonX}px !important`,
                  borderRadius: '0.5rem',
                },
              },
            }}
          />
        </li>
        <Link href="/">
          <li className="flex h-full flex-row items-center gap-3 rounded-lg p-2 transition-all hover:bg-neutral-900">
            <Path is="/">
              <AiFillHome className="flex h-full text-3xl" />
              <Desktop>
                <span className="font-medium">Home</span>
              </Desktop>
            </Path>
            <Path not="/">
              <AiOutlineHome className="flex h-full text-3xl" />
              <Desktop>Home</Desktop>
            </Path>
          </li>
        </Link>
        <Link href="/ideas">
          <li className="flex h-full flex-row items-center gap-3 rounded-lg p-2 transition-all hover:bg-neutral-900">
            <Path is="/ideas">
              <FaLightbulb className="flex h-full text-3xl" />
              <Desktop>
                <span className="font-medium">Ideas</span>
              </Desktop>
            </Path>
            <Path not="/ideas">
              <FaRegLightbulb className="flex h-full text-3xl" />
              <Desktop>Ideas</Desktop>
            </Path>
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <SignedOut>
        <div className="flex h-screen items-center justify-center">
          <SignIn />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full max-w-4xl flex-row">
            <Navigation />
            <div className="w-80 flex-auto flex-col">{props.children}</div>
          </div>
        </div>
      </SignedIn>
    </>
  );
};
