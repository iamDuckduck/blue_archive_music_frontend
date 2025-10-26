import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  type RefObject,
  useRef,
} from "react";
import type OstPage from "../entities/OstPage";
import type OstType from "../entities/OstType";

export interface Track {
  id: number;
  name: string;
  src: string;
  author: string;
  thumbnail?: string;
}
interface AudioPlayerContextType {
  currentTrack: Track;
  setCurrentTrack: Dispatch<SetStateAction<Track>>;
  trackList: OstPage[];
  setTrackList: Dispatch<SetStateAction<OstPage[]>>;
  audioRef: RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  timeProgress: number;
  setTimeProgress: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  trackIndex: number;
  setTrackIndex: Dispatch<SetStateAction<number>>;
  currentType: OstType;
  setCurrentType: Dispatch<SetStateAction<OstType>>;
}
const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);
export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track>({} as Track);
  const [trackList, setTrackList] = useState<OstPage[]>({} as OstPage[]);
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentType, setCurrentType] = useState<OstType>({} as OstType);
  const audioRef = useRef<HTMLAudioElement>(null);

  const contextValue = {
    currentTrack,
    setCurrentTrack,
    trackList,
    setTrackList,
    audioRef,
    isPlaying,
    setIsPlaying,
    timeProgress,
    setTimeProgress,
    duration,
    setDuration,
    trackIndex,
    setTrackIndex,
    currentType,
    setCurrentType,
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
