import { createContext, useState, type PropsWithChildren } from 'react';

interface PlayerContextType {
  isPlaying: boolean;
  id: number | null;
  uri: string | null;
  setIsPlaying: (isPlaying: boolean) => void;
  setId: (id: number) => void;
  setUri: (uri: string) => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);
export const PlayerProvider = ({ children }: PropsWithChildren) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [uri, setUri] = useState<string | null>(null);

  return (
    <PlayerContext.Provider value={{ isPlaying, setIsPlaying, uri, setUri, id, setId }}>
      {children}
    </PlayerContext.Provider>
  );
};
