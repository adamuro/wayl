import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRef, type PropsWithChildren } from 'react';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { FaLightbulb, FaRegLightbulb } from 'react-icons/fa';
import { useDevice } from '~/hooks/device';
import { useRefPosition } from '~/hooks/position';
import { Path } from './path';

const Navigation = () => {
  const device = useDevice();

  const userButtonRef = useRef<HTMLLIElement>(null);
  const { position, updatePosition } = useRefPosition(userButtonRef);

  return (
    <nav className="sticky top-0 h-screen flex-1 flex-col items-end">
      <ul className="ml-auto flex w-fit flex-col gap-1 p-2 text-xl">
        <li
          ref={userButtonRef}
          onPointerEnter={updatePosition}
          className="flex w-fit rounded-lg p-2 transition-all hover:bg-neutral-900"
        >
          <UserButton
            showName={device === 'desktop'}
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: { width: '30px', height: '30px' },
                userButtonOuterIdentifier:
                  'font-sans font-medium text-xl cl-userButtonTrigger text-inherit',
                userButtonBox: 'flex-row-reverse gap-3',
                userButtonPopoverCard: {
                  left: `${position.x}px !important`,
                  borderRadius: '0.5rem',
                },
              },
            }}
          />
        </li>
        <li>
          <Link
            href="/"
            className="flex flex-row gap-3 rounded-lg p-2 transition-all hover:bg-neutral-900 hover:text-teal-100"
          >
            <Path is="/">
              <AiFillHome className="text-3xl text-teal-400" />
              <span className="font-medium text-teal-400 mobile:hidden">Home</span>
            </Path>
            <Path not="/">
              <AiOutlineHome className="text-3xl" />
              <span className="mobile:hidden">Home</span>
            </Path>
          </Link>
        </li>
        <li>
          <Link
            href="/ideas"
            className="flex flex-row gap-3 rounded-lg p-2 transition-all hover:bg-neutral-900 hover:text-teal-100"
          >
            <Path is="/ideas">
              <FaLightbulb className="text-3xl text-teal-400" />
              <span className="font-medium text-teal-400 mobile:hidden">Ideas</span>
            </Path>
            <Path not="/ideas">
              <FaRegLightbulb className="text-3xl" />
              <span className="mobile:hidden">Ideas</span>
            </Path>
          </Link>
        </li>
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
        <div className="flex h-full flex-row justify-center">
          <Navigation />
          <main className="w-full max-w-2xl border-x border-neutral-700 mobile:flex-auto desktop:min-w-2xl desktop:flex-1">
            {props.children}
          </main>
          <aside className="flex-1"></aside>
        </div>
      </SignedIn>
    </>
  );
};
