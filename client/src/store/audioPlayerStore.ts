import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  /**
   * Generic Track[] queue used by the new song-page-driven flows.
   * The legacy `trackList` is OstPage-shaped and tied to the
   * /OST DataGrid; once that page is removed the two will collapse.
   */
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  timeProgress: number;
  duration: number;
  volume: number; // 0-1
  muted: boolean;

  setCurrentTrack: (t: Track) => void;
  setCurrentType: (t: OstType) => void;
  setTrackList: (l: OstPage[]) => void;
  setTrackIndex: (i: number) => void;
  setQueue: (q: Track[]) => void;
  setQueueIndex: (i: number) => void;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setTimeProgress: (n: number) => void;
  setDuration: (n: number) => void;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  toggleMuted: () => void;
}

const emptyTrack: Track = {
  id: 0,
  name: "",
  src: "",
  author: "",
};

export const useAudioPlayerStore = create<AudioPlayerState>()(
  persist(
    (set) => ({
      currentTrack: emptyTrack,
      currentType: {} as OstType,
      trackList: [] as OstPage[],
      trackIndex: 0,
      queue: [] as Track[],
      queueIndex: 0,
      isPlaying: false,
      timeProgress: 0,
      duration: 0,
      volume: 0.6,
      muted: false,

      setCurrentTrack: (t) => set({ currentTrack: t }),
      setCurrentType: (t) => set({ currentType: t }),
      setTrackList: (l) => set({ trackList: l }),
      setTrackIndex: (i) => set({ trackIndex: i }),
      setQueue: (q) => set({ queue: q }),
      setQueueIndex: (i) => set({ queueIndex: i }),
      // Mirrors React's useState setter: accepts either a new value or an
      // updater function, so existing call sites like `setIsPlaying(p => !p)`
      // keep working unchanged.
      setIsPlaying: (b) =>
        set((s) => ({
          isPlaying: typeof b === "function" ? b(s.isPlaying) : b,
        })),
      setTimeProgress: (n) => set({ timeProgress: n }),
      setDuration: (n) => set({ duration: n }),
      setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),
      setMuted: (m) => set({ muted: m }),
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
    }),
    {
      name: "ba-audio-player",
      partialize: (s) => ({ volume: s.volume, muted: s.muted }),
    }
  )
);
