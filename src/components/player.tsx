import { useEffect, useState } from 'react';
import SpotifyPlayer, { type CallbackState } from 'react-spotify-web-playback';
import { api } from '~/utils/api';

interface PlayerProps {
  uri?: string;
}

export const Player = ({ uri }: PlayerProps) => {
  const [play, setPlay] = useState(false);
  const token = api.spotify.getToken.useQuery();

  useEffect(() => setPlay(true), [uri]);

  const callback = (state: CallbackState) => {
    if (!state.isPlaying) setPlay(false);
  };

  if (!token.data) return null;

  return (
    <SpotifyPlayer
      play={play}
      callback={callback}
      token={token.data}
      uris={uri ? [uri] : []}
      showSaveIcon
      hideAttribution={true}
      styles={{
        bgColor: 'black',
        color: 'white',
        trackNameColor: 'cyan',
        trackArtistColor: 'white',
        activeColor: 'cyan',
        sliderColor: 'cyan',
        sliderHandleColor: 'white',
      }}
    />
  );
};
