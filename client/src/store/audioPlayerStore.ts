import { create } from "zustand";
import type { Dispatch, SetStateAction } from "react";
import type OstPage from "../entities/OstPage";
import type OstType from "../entities/OstType";

export interface Track {
  id: number;
  name: string;
  src: string;
  author: string;
  thumbnail?: string;
}

interface AudioPlayerState {
  currentTrack: Track;
  currentType: OstType;
  trackList: OstPage[];
  trackIndex: number;
  isPlaying: boolean;
  timeProgress: number;
  duration: number;

  setCurrentTrack: (t: Track) => void;
  setCurrentType: (t: OstType) => void;
  setTrackList: (l: OstPage[]) => void;
  setTrackIndex: (i: number) => void;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setTimeProgress: (n: number) => void;
  setDuration: (n: number) => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>()((set) => ({
  currentTrack: {} as Track,
  currentType: {} as OstType,
  trackList: [] as OstPage[],
  trackIndex: 0,
  isPlaying: false,
  timeProgress: 0,
  duration: 0,

  setCurrentTrack: (t) => set({ currentTrack: t }),
  setCurrentType: (t) => set({ currentType: t }),
  setTrackList: (l) => set({ trackList: l }),
  setTrackIndex: (i) => set({ trackIndex: i }),
  // Mirrors React's useState setter: accepts either a new value or an
  // updater function, so existing call sites like `setIsPlaying(p => !p)`
  // keep working unchanged.
  setIsPlaying: (b) =>
    set((s) => ({
      isPlaying: typeof b === "function" ? b(s.isPlaying) : b,
    })),
  setTimeProgress: (n) => set({ timeProgress: n }),
  setDuration: (n) => set({ duration: n }),
}));
