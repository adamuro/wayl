import Image from 'next/image';

interface AvatarProps {
  name: string;
  url: string;
}

export const Avatar = (props: AvatarProps) => {
  return (
    <div>
      <div className="w-10">
        <Image
          alt={`${props.name} profile picture`}
          src={props.url}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full"
        />
      </div>
    </div>
  );
};
