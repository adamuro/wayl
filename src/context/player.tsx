import { createContext, useState, type PropsWithChildren } from 'react';

interface PlayerContextType {
  isPlaying: boolean;
  songId: number | null;
  songUri: string | null;
  setIsPlaying: (isPlaying: boolean) => void;
  setSongId: (id: number) => void;
  setSongUri: (uri: string) => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);
export const PlayerProvider = ({ children }: PropsWithChildren) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songId, setSongId] = useState<number | null>(null);
  const [songUri, setSongUri] = useState<string | null>(null);

  return (
    <PlayerContext.Provider
      value={{ isPlaying, setIsPlaying, songUri, setSongUri, songId, setSongId }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
