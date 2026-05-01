import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Dispatch, SetStateAction } from "react";
import { audioRef } from "../audio/audioEngine";

export interface Track {
  id: number;
  name: string;
  src: string;
  author: string;
  thumbnail?: string;
  /** Source label shown in media bars (e.g. album title for SongPage / random pick). */
  albumTitle?: string;
}

export type PlaybackSource =
  | { kind: "album"; albumId: number; title: string }
  | { kind: "random" };

export type RepeatMode = "off" | "all" | "one";
export type ShuffleMode = "off" | "on";

interface LoadQueueOptions {
  source: PlaybackSource;
  startIndex?: number;
  autoplay?: boolean;
}

interface AudioPlayerState {
  currentTrack: Track;
  queue: Track[];
  queueIndex: number;
  source: PlaybackSource | null;
  repeat: RepeatMode;
  shuffle: ShuffleMode;
  /** Permutation of queue indices used while `shuffle === "on"`. */
  shuffledOrder: number[] | null;
  /** Registered by the Home page; called when a random track ends or Next is pressed. */
  randomFetcher: (() => void) | null;

  isPlaying: boolean;
  timeProgress: number;
  duration: number;
  volume: number; // 0-1
  muted: boolean;

  // Random source uses setCurrentTrack via useRandomSong; album/playlist
  // sources go through loadQueue. setQueue/setQueueIndex are no longer
  // needed externally.
  setCurrentTrack: (t: Track) => void;

  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setTimeProgress: (n: number) => void;
  setDuration: (n: number) => void;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  toggleMuted: () => void;

  // New playback API
  loadQueue: (tracks: Track[], opts: LoadQueueOptions) => void;
  playNext: () => void;
  playPrev: () => void;
  onTrackEnded: () => void;
  setRepeat: (mode: RepeatMode) => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  setRandomFetcher: (fn: (() => void) | null) => void;
}

const emptyTrack: Track = {
  id: 0,
  name: "",
  src: "",
  author: "",
};

const sourceKindChanged = (
  prev: PlaybackSource | null,
  next: PlaybackSource
): boolean => {
  if (!prev) return true;
  if (prev.kind !== next.kind) return true;
  if (prev.kind === "album" && next.kind === "album") {
    return prev.albumId !== next.albumId;
  }
  return false;
};

const buildShuffledOrder = (length: number, pinFirst: number): number[] => {
  // Fisher-Yates over [0..length) excluding pinFirst, then prepend pinFirst.
  const rest: number[] = [];
  for (let i = 0; i < length; i++) if (i !== pinFirst) rest.push(i);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [pinFirst, ...rest];
};

export const useAudioPlayerStore = create<AudioPlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: emptyTrack,
      queue: [] as Track[],
      queueIndex: 0,
      source: null,
      repeat: "off",
      shuffle: "off",
      shuffledOrder: null,
      randomFetcher: null,

      isPlaying: false,
      timeProgress: 0,
      duration: 0,
      volume: 0.6,
      muted: false,

      setCurrentTrack: (t) => set({ currentTrack: t }),
      setIsPlaying: (b) =>
        set((s) => ({
          isPlaying: typeof b === "function" ? b(s.isPlaying) : b,
        })),
      setTimeProgress: (n) => set({ timeProgress: n }),
      setDuration: (n) => set({ duration: n }),
      setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),
      setMuted: (m) => set({ muted: m }),
      toggleMuted: () => set((s) => ({ muted: !s.muted })),

      loadQueue: (tracks, opts) => {
        const startIndex = opts.startIndex ?? 0;
        const autoplay = opts.autoplay ?? true;
        const reset = sourceKindChanged(get().source, opts.source);
        const safeIndex =
          tracks.length === 0
            ? 0
            : Math.min(Math.max(0, startIndex), tracks.length - 1);
        set((s) => ({
          queue: tracks,
          queueIndex: safeIndex,
          currentTrack: tracks[safeIndex] ?? s.currentTrack,
          source: opts.source,
          isPlaying: tracks.length > 0 ? autoplay : false,
          ...(reset
            ? {
                repeat: opts.source.kind === "album" ? "all" : "off",
                shuffle: "off",
                shuffledOrder: null,
              }
            : {}),
        }));
      },

      playNext: () => {
        const s = get();
        if (s.source?.kind === "random") {
          if (s.randomFetcher) s.randomFetcher();
          else set({ isPlaying: false });
          return;
        }
        if (s.queue.length === 0) return;
        const order =
          s.shuffle === "on" && s.shuffledOrder
            ? s.shuffledOrder
            : s.queue.map((_, i) => i);
        const cursor = Math.max(0, order.indexOf(s.queueIndex));
        const nextCursor = (cursor + 1) % order.length;
        const nextIndex = order[nextCursor];
        set({
          queueIndex: nextIndex,
          currentTrack: s.queue[nextIndex],
          isPlaying: true,
        });
      },

      playPrev: () => {
        const s = get();
        if (s.source?.kind === "random") {
          if (s.randomFetcher) s.randomFetcher();
          else set({ isPlaying: false });
          return;
        }
        if (s.queue.length === 0) return;
        const order =
          s.shuffle === "on" && s.shuffledOrder
            ? s.shuffledOrder
            : s.queue.map((_, i) => i);
        const cursor = Math.max(0, order.indexOf(s.queueIndex));
        const prevCursor = (cursor - 1 + order.length) % order.length;
        const prevIndex = order[prevCursor];
        set({
          queueIndex: prevIndex,
          currentTrack: s.queue[prevIndex],
          isPlaying: true,
        });
      },

      onTrackEnded: () => {
        const s = get();
        if (s.repeat === "one") {
          const a = audioRef.current;
          if (a) {
            a.currentTime = 0;
            a.play().catch(() => set({ isPlaying: false }));
          }
          return;
        }
        if (s.source?.kind === "random") {
          if (s.randomFetcher) s.randomFetcher();
          else set({ isPlaying: false });
          return;
        }
        if (s.queue.length === 0) {
          set({ isPlaying: false });
          return;
        }
        const order =
          s.shuffle === "on" && s.shuffledOrder
            ? s.shuffledOrder
            : s.queue.map((_, i) => i);
        const cursor = Math.max(0, order.indexOf(s.queueIndex));
        const atEnd = cursor + 1 >= order.length;
        if (atEnd && s.repeat !== "all") {
          set({ isPlaying: false });
          return;
        }
        const nextCursor = (cursor + 1) % order.length;
        const nextIndex = order[nextCursor];
        set({
          queueIndex: nextIndex,
          currentTrack: s.queue[nextIndex],
          isPlaying: true,
        });
      },

      setRepeat: (mode) => set({ repeat: mode }),
      cycleRepeat: () =>
        set((s) => ({
          repeat:
            s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
        })),

      toggleShuffle: () => {
        const s = get();
        if (s.shuffle === "on") {
          set({ shuffle: "off", shuffledOrder: null });
          return;
        }
        if (s.queue.length === 0) {
          set({ shuffle: "on", shuffledOrder: [] });
          return;
        }
        set({
          shuffle: "on",
          shuffledOrder: buildShuffledOrder(s.queue.length, s.queueIndex),
        });
      },

      setRandomFetcher: (fn) => set({ randomFetcher: fn }),
    }),
    {
      name: "ba-audio-player",
      partialize: (s) => ({ volume: s.volume, muted: s.muted }),
    }
  )
);
