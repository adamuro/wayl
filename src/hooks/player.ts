import { useContext } from 'react';
import { PlayerContext } from '~/context/player';

export const usePlayer = () => {
  const player = useContext(PlayerContext);
  const pause = () => player?.setIsPlaying(false);
  const play = (id: number, uri: string) => {
    player?.setIsPlaying(true);
    player?.setSongId(id);
    player?.setSongUri(uri);
  };

  return {
    ...player,
    play,
    pause,
  };
};
