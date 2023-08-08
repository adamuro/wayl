/* Default avatar URL */
/* https://www.freepik.com/icon/user_1077114#position=2&page=1&term=user&fromView=keyword */

import Image from 'next/image';
import { useState } from 'react';
import avatarDefault from '~/assets/avatar-default.png';
import { UserTooltip } from './tooltip';
import Link from 'next/link';
import { profileLink } from '~/utils/user';

interface AvatarProps {
  id: string;
  anchorId?: string;
  name: string;
  url: string;
}

export const Avatar = (props: AvatarProps) => {
  const [error, setError] = useState(false);
  const anchorId = props.anchorId || `${props.id}-avatar`;

  return (
    <>
      <div>
        <div className="w-10">
          <Link href={profileLink(props.id)}>
            <Image
              id={anchorId}
              alt={`${props.name} profile picture`}
              src={error ? avatarDefault : props.url}
              width={40}
              height={40}
              onError={() => setError(true)}
              className="h-10 w-10 cursor-pointer rounded-full"
            />
          </Link>
        </div>
      </div>
      <UserTooltip id={props.id} anchorId={anchorId} name={props.name} />
    </>
  );
};
