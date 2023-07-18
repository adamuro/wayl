import Image from 'next/image';
import { useState } from 'react';
import avatarDefault from '~/assets/avatar-default.png';

interface AvatarProps {
  name: string;
  url: string;
}

export const Avatar = (props: AvatarProps) => {
  const [error, setError] = useState(false);

  return (
    <div>
      <div className="w-10">
        <Image
          alt={`${props.name} profile picture`}
          src={error ? avatarDefault : props.url}
          width={40}
          height={40}
          onError={() => setError(true)}
          className="h-10 w-10 rounded-full"
        />
      </div>
    </div>
  );
};
