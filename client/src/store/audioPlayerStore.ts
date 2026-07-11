import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Dispatch, SetStateAction } from "react";
import { audioRef } from "../audio/audioEngine";

export interface Track {
  id: number;
  songId?: number;
  name: string;
  src: string;
  author: string;
  thumbnail?: string;
  /** Source label shown in media bars (e.g. album title for SongPage / random pick). */
  albumTitle?: string;
}

export type PlaybackSource =
  | { kind: "album"; albumId: number; title: string }
  /** Auto-populated discover queue — random songs fetched on first load or near-end refill. */
  | { kind: "discover" };

export type RepeatMode = "off" | "all" | "one";
export type ShuffleMode = "off" | "on";

interface LoadQueueOptions {
  source: PlaybackSource;
  startIndex?: number;
  autoplay?: boolean;
}

interface AudioPlayerState {
  currentTrack: Track;
  playCountResetKey: number;
  queue: Track[];
  queueIndex: number;
  source: PlaybackSource | null;
  repeat: RepeatMode;
  shuffle: ShuffleMode;
  /** Permutation of queue indices used while `shuffle === "on"`. */
  shuffledOrder: number[] | null;

  /** random-song-list query's isFetching flag*/
  randomLoading: boolean;

  isPlaying: boolean;
  timeProgress: number;
  duration: number;
  volume: number; // 0-1
  muted: boolean;

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
  appendDiscoverTracks: (tracks: Track[]) => void;
  setRandomLoading: (v: boolean) => void;
}

const emptyTrack: Track = {
  id: 0,
  name: "",
  src: "",
  author: "",
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
      playCountResetKey: 0,
      queue: [] as Track[],
      queueIndex: 0,
      source: null,
      repeat: "off",
      shuffle: "off",
      shuffledOrder: null,

      randomLoading: false,

      isPlaying: false,
      timeProgress: 0,
      duration: 0,
      volume: 0.6,
      muted: false,
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
        const safeIndex =
          tracks.length === 0
            ? 0
            : Math.min(Math.max(0, startIndex), tracks.length - 1);
        set((s) => {
          const preserveShuffle =
            opts.source.kind === "album" &&
            s.shuffle === "on" &&
            tracks.length > 0;

          return {
            queue: tracks,
            queueIndex: safeIndex,
            currentTrack: tracks[safeIndex] ?? s.currentTrack,
            playCountResetKey:
              tracks.length > 0 ? s.playCountResetKey + 1 : s.playCountResetKey,
            source: opts.source,
            isPlaying: tracks.length > 0 ? autoplay : false,
            shuffle: preserveShuffle ? "on" : "off",
            shuffledOrder: preserveShuffle
              ? buildShuffledOrder(tracks.length, safeIndex)
              : null,
          };
        });
      },

      playNext: () => {
        const s = get();
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
          playCountResetKey: s.playCountResetKey + 1,
          isPlaying: true,
        });
      },

      playPrev: () => {
        const s = get();
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
          playCountResetKey: s.playCountResetKey + 1,
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
          playCountResetKey: s.playCountResetKey + 1,
          isPlaying: true,
        });
      },

      setRepeat: (mode) => set({ repeat: mode }),
      cycleRepeat: () =>
        set((s) => ({
          repeat:
            s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
        })),
      appendDiscoverTracks: (tracks) =>
        set((s) => ({
          queue: [...s.queue, ...tracks],
          source: { kind: "discover" },
          shuffle: "off",
          shuffledOrder: null,
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

      setRandomLoading: (v) => set({ randomLoading: v }),
    }),
    {
      name: "ba-audio-player",
      partialize: (s) => ({ volume: s.volume, muted: s.muted }),
    },
  ),
);
