/**
 * Module-level singletons for the audio engine.
 *
 * These are NOT React state. They are plain mutable boxes whose `.current`
 * is written by React (via `<audio ref={audioRef}>` in RootLayout) or by
 * pages (via `onTrackEndRef.current = handler`).
 *
 * They live here — not in the zustand store — because:
 *   1. DOM handles aren't "state" (mutating .current never needs to trigger
 *      a re-render).
 *   2. Keeps the store free of non-serializable, non-reactive fields.
 *   3. Lets `useAudioEngine` import refs without depending on the store.
 */

export const audioRef: { current: HTMLAudioElement | null } = { current: null };

export const onTrackEndRef: { current: (() => void) | null } = { current: null };
