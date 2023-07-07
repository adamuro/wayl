import Image from 'next/image';
import { IoPause, IoPlay } from 'react-icons/io5';
import { type RouterOutputs } from '~/utils/api';

export type FeedSong = RouterOutputs['songs']['getCurrentUserFeed'][number];
interface FeedSongProps {
  song: FeedSong;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export const FeedSong = ({ song, isPlaying, onPlay, onPause }: FeedSongProps) => {
  return (
    <li className="flex items-center justify-between transition-colors hover:bg-neutral-900">
      <div className="flex items-center gap-4 py-4 pl-4 transition-colors hover:text-teal-400">
        <div>
          <div className="w-9">
            <Image
              alt={`${song.user.name} profile picture`}
              src={song.user.avatarUrl}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full"
            />
          </div>
        </div>
        <div className="hidden w-full sm:flex">
          <div className="flex flex-col break-words">
            <span className="font-semibold leading-5">{song.user.name}</span>
            <span className="break-words text-xs text-neutral-50">2h ago</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4">
        <div className="flex w-full items-center justify-between text-right">
          <div className="flex flex-col break-words">
            <span
              data-playing={isPlaying}
              className="font-semibold leading-5 transition-colors data-[playing=true]:text-teal-400"
            >
              {song.title}
            </span>
            <span className="break-words text-xs text-neutral-50">{song.authors.join(', ')}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="items h-10 w-10">
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="group relative cursor-pointer hover:text-teal-400"
            >
              <Image
                alt={`${song.title} album image`}
                src={song.imageUrl || ''}
                width={40}
                height={40}
                className="relative z-20 h-10 w-10 transition-opacity group-hover:opacity-50"
              />
              <div
                data-playing={isPlaying}
                className="absolute top-0 z-20 flex h-10 w-10 items-center justify-center opacity-80 transition-opacity group-hover:opacity-100  data-[playing=true]:opacity-100"
              >
                {isPlaying ? (
                  <IoPause className="text-2xl transition-colors" />
                ) : (
                  <IoPlay className="text-2xl transition-colors" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};
