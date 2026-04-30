/**
 * Back-compat shim during the Zustand migration.
 *
 * The real state now lives in `src/store/audioPlayerStore.ts`; DOM refs
 * live in `src/audio/audioEngine.ts`. This file keeps the old
 * `useAudioPlayerContext` / `AudioPlayerProvider` API alive so consumers
 * don't all need to change in the same commit.
 *
 * - `AudioPlayerProvider` is now a no-op pass-through.
 * - `useAudioPlayerContext` returns the same shape as before, powered by
 *   the store (whole-state subscription — same re-render behavior as the
 *   old context).
 *
 * Both will be deleted in commit 3 once consumers migrate to per-field
 * selectors.
 */

import type { ReactNode, RefObject, MutableRefObject } from "react";
import { useAudioPlayerStore, type Track } from "../store/audioPlayerStore";
import { audioRef, onTrackEndRef } from "../audio/audioEngine";

export type { Track };

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const useAudioPlayerContext = () => {
  const state = useAudioPlayerStore();
  return {
    ...state,
    audioRef: audioRef as RefObject<HTMLAudioElement | null>,
    onTrackEndRef: onTrackEndRef as MutableRefObject<(() => void) | null>,
  };
};
