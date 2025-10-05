import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type OstPage from "../entities/OstPage";

export interface Track {
  title: string;
  src: string;
  author: string;
  thumbnail?: string;
}
interface AudioPlayerContextType {
  currentTrack: Track;
  setCurrentTrack: Dispatch<SetStateAction<Track>>;
  trackList: OstPage[];
  setTrackList: Dispatch<SetStateAction<OstPage[]>>;
}
const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);
export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track>({} as Track);
  const [trackList, setTrackList] = useState<OstPage[]>({} as OstPage[]);

  const contextValue = {
    currentTrack,
    setCurrentTrack,
    trackList,
    setTrackList,
  };
  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
export const useAudioPlayerContext = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayerContext must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
