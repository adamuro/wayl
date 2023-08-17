import { useState } from 'react';
import SpotifyPlayer, { type CallbackState } from 'react-spotify-web-playback';
import { usePlayer } from '~/hooks/player';
import { api } from '~/utils/api';

export const Player = () => {
  const [wasPlaying, setWasPlaying] = useState(false);
  const player = usePlayer();
  const changedOutside = wasPlaying !== player.isPlaying;
  const token = api.spotify.getToken.useQuery();

  const callback = (state: CallbackState) => {
    if (changedOutside) return setWasPlaying(player.isPlaying ?? false);
    player.setIsPlaying?.(state.isPlaying);
    setWasPlaying(state.isPlaying);
  };

  if (!token.data) return null;

  return (
    <SpotifyPlayer
      play={player.isPlaying}
      callback={callback}
      token={token.data}
      uris={player.songUri ? [player.songUri] : []}
      showSaveIcon
      hideAttribution={true}
      styles={{
        bgColor: 'black',
        color: 'white',
        trackNameColor: '#2dd4bf',
        trackArtistColor: 'white',
        activeColor: '#2dd4bf',
        sliderColor: '#2dd4bf',
        sliderHandleColor: 'white',
      }}
    />
  );
};
