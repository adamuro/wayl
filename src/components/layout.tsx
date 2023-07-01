import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRef, type PropsWithChildren } from 'react';
import { type IconType } from 'react-icons';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { FaLightbulb, FaRegLightbulb } from 'react-icons/fa';
import { MdPeople, MdPeopleOutline } from 'react-icons/md';
import { useDevice } from '~/hooks/device';
import { useRefPosition } from '~/hooks/position';
import { Path } from './path';

interface NavigationItemProps {
  name: string;
  path: string;
  IconFill: IconType;
  IconOutline: IconType;
}

const NavigationItem = ({ name, path, IconFill, IconOutline }: NavigationItemProps) => {
  const device = useDevice();

  return (
    <li title={device.mobile ? name : ''}>
      <Link
        href={path}
        className="flex flex-row gap-3 rounded-lg p-2 transition-all hover:bg-neutral-900 hover:text-teal-100"
      >
        <Path is={path}>
          <IconFill className="text-3xl text-teal-400" />
          <span className="hidden font-medium text-teal-400 lg:flex">{name}</span>
        </Path>
        <Path not={path}>
          <IconOutline className="text-3xl" />
          <span className="hidden lg:flex">{name}</span>
        </Path>
      </Link>
    </li>
  );
};

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
            showName={device.desktop}
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
        <NavigationItem name="Home" path="/" IconFill={AiFillHome} IconOutline={AiOutlineHome} />
        <NavigationItem
          name="Follows"
          path="/follows"
          IconFill={MdPeople}
          IconOutline={MdPeopleOutline}
        />
        <NavigationItem
          name="Ideas"
          path="/ideas"
          IconFill={FaLightbulb}
          IconOutline={FaRegLightbulb}
        />
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
          <main className="flex w-full max-w-2xl flex-auto flex-col border-x border-neutral-700">
            {props.children}
          </main>
          <aside className="flex-1"></aside>
        </div>
      </SignedIn>
    </>
  );
};
