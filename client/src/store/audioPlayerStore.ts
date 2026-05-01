import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Dispatch, SetStateAction } from "react";

export interface Track {
  id: number;
  name: string;
  src: string;
  author: string;
  thumbnail?: string;
  /** Source label shown in media bars (e.g. album title for SongPage / random pick). */
  albumTitle?: string;
}

interface AudioPlayerState {
  currentTrack: Track;
  /** Generic Track[] queue used by SongPage and any future page-driven flows. */
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  timeProgress: number;
  duration: number;
  volume: number; // 0-1
  muted: boolean;

  setCurrentTrack: (t: Track) => void;
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
      queue: [] as Track[],
      queueIndex: 0,
      isPlaying: false,
      timeProgress: 0,
      duration: 0,
      volume: 0.6,
      muted: false,

      setCurrentTrack: (t) => set({ currentTrack: t }),
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
