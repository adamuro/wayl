import { PiHeart, PiHeartFill } from 'react-icons/pi';

interface LikeIconProps {
  isLiked: unknown;
  isHovered: boolean;
}

export const LikeIcon = ({ isLiked, isHovered }: LikeIconProps) => {
  return isLiked ? (
    <PiHeartFill className="text-teal-400 transition-colors group-hover/like:text-neutral-50" />
  ) : isHovered ? (
    <PiHeartFill className="text-teal-400" />
  ) : (
    <PiHeart className="text-neutral-50" />
  );
};
