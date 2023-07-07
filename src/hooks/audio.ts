import { useCallback, useEffect, useState } from 'react';

const DEFAULT_VOLUME = 0.2;

interface AudioOptions {
  volume?: number;
}

export const useAudio = (options?: AudioOptions) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const pause = useCallback(() => void audio?.pause(), [audio]);
  const play = useCallback(
    (song?: SpotifyApi.TrackObjectFull) => {
      setCurrent(song?.id ?? null);

      if (!song?.preview_url) return audio?.pause();
      if (song.id === current) return void audio?.play();

      audio?.pause();
      audio?.remove();

      const newAudio = new Audio(song.preview_url);
      newAudio.addEventListener('play', () => setPlaying(true));
      newAudio.addEventListener('pause', () => setPlaying(false));
      newAudio.volume = options?.volume || DEFAULT_VOLUME;
      void newAudio.play().then(() => setAudio(newAudio));
    },
    [audio, current, options],
  );

  const switchAudio = useCallback(() => {
    audio?.paused ? void audio.play() : audio?.pause();
  }, [audio]);

  useEffect(() => {
    return () => {
      audio?.pause();
      audio?.remove();
    };
  }, [audio]);

  return {
    play,
    pause,
    switch: switchAudio,
    current,
    playing,
    paused: !playing,
  };
};
