import Image from 'next/image';
import { IoPause, IoPlay } from 'react-icons/io5';
import { useAudio } from '~/hooks/audio';
import { type RouterOutputs } from '~/utils/api';

export type SpotifySong = RouterOutputs['spotify']['getSongs'][number];
interface SongSearchResultsProps {
  songs: SpotifySong[];
  onSelect: (song: SpotifySong) => void;
}

export const SongSearchResults = ({ songs, onSelect }: SongSearchResultsProps) => {
  const audio = useAudio();

  const handleSelect = (song: SpotifySong) => {
    audio.pause();
    onSelect(song);
  };

  const handlePreview = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, song: SpotifySong) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (audio.current === song.id) return audio.switch();
    audio.play(song);
  };

  return songs.map((song) => (
    <li
      key={song.id}
      onMouseDown={() => handleSelect(song)}
      className="flex cursor-pointer items-center gap-4 py-2 pl-4 transition-colors hover:bg-neutral-900 hover:text-teal-400"
    >
      <Image
        alt={`${song.name} album image`}
        src={song.album.images.at(-1)?.url || ''}
        width={36}
        height={36}
        className="h-9 w-9"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col break-words">
          <span className="font-medium leading-5">{song.name}</span>
          <span className="break-words text-xs text-neutral-50">
            {song.artists.map((artist) => artist.name).join(', ')}
          </span>
        </div>
        <button
          disabled={!song.preview_url}
          title={audio.playing && audio.current === song.id ? 'Pause' : 'Play'}
          onMouseDown={(e) => handlePreview(e, song)}
          className="p-2 text-neutral-50 transition-colors hover:text-teal-400 disabled:text-neutral-700"
        >
          {audio.playing && audio.current === song.id ? (
            <IoPause className="text-xl" />
          ) : (
            <IoPlay className="text-xl" />
          )}
        </button>
      </div>
    </li>
  ));
};
