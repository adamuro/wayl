import { PiHeart, PiHeartFill } from 'react-icons/pi';

interface LikeIconProps {
  liked: unknown;
  hover: boolean;
}

export const LikeIcon = ({ liked, hover }: LikeIconProps) => {
  return liked ? (
    <PiHeartFill className="text-teal-400 transition-colors group-hover/like:text-neutral-50" />
  ) : hover ? (
    <PiHeartFill className="text-teal-400" />
  ) : (
    <PiHeart className="text-neutral-50" />
  );
};
