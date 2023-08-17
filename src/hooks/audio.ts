import { useCallback, useEffect, useState } from 'react';

const DEFAULT_VOLUME = 0.2;

interface AudioOptions {
  volume?: number;
}

export const useAudio = (options?: AudioOptions) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [songId, setSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const pause = useCallback(() => void audio?.pause(), [audio]);
  const play = useCallback(
    (song?: SpotifyApi.TrackObjectFull) => {
      setSongId(song?.id ?? null);

      if (!song?.preview_url) return audio?.pause();
      if (song.id === songId) return void audio?.play();

      audio?.pause();
      audio?.remove();

      const newAudio = new Audio(song.preview_url);
      newAudio.addEventListener('play', () => setIsPlaying(true));
      newAudio.addEventListener('pause', () => setIsPlaying(false));
      newAudio.volume = options?.volume || DEFAULT_VOLUME;
      void newAudio.play().then(() => setAudio(newAudio));
    },
    [audio, songId, options],
  );

  const switchPlay = useCallback(() => {
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
    switch: switchPlay,
    songId,
    isPlaying,
    paused: !isPlaying,
  };
};
