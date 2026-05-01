/**
 * Module-level singleton for the audio engine.
 *
 * `audioRef.current` is written by React (via `<audio ref={audioRef}>` in
 * RootLayout) and read by anything that needs to drive the underlying DOM
 * audio element directly (e.g. seek, repeat="one" restart).
 *
 * This is NOT React state — mutating `.current` should never trigger a
 * re-render — and it lives here, not in the zustand store, to keep the
 * store free of non-serializable, non-reactive fields.
 *
 * Track-end behavior is owned by the store; see `onTrackEnded` in
 * `audioPlayerStore.ts`.
 */

export const audioRef: { current: HTMLAudioElement | null } = { current: null };
