import SpotifyPlayer, { type CallbackState } from 'react-spotify-web-playback';
import { api } from '~/utils/api';

interface PlayerProps {
  play: boolean;
  onPlay: () => void;
  onPause: () => void;
  uri?: string;
}

export const Player = ({ play, onPlay, onPause, uri }: PlayerProps) => {
  const token = api.spotify.getToken.useQuery();

  const callback = (state: CallbackState) => {
    if (state.isPlaying) return onPlay();
    onPause();
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
        trackNameColor: '#2dd4bf',
        trackArtistColor: 'white',
        activeColor: '#2dd4bf',
        sliderColor: '#2dd4bf',
        sliderHandleColor: 'white',
      }}
    />
  );
};
