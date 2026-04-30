import { useEffect, useRef } from "react";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { audioRef } from "../audio/audioEngine";

/**
 * Single source of truth for audio playback side-effects.
 * Mounted once in RootLayout (where <audio> lives).
 *
 *  - Reacts to `isPlaying` to play/pause the <audio> element.
 *  - Drives a requestAnimationFrame loop that mirrors
 *    audio.currentTime into the `timeProgress` store state.
 *
 * UI components (Controls, HomeMediaPlayer, etc.) are pure consumers:
 * they read state and dispatch via setIsPlaying / seek, but never
 * touch RAF or play()/pause() directly.
 */
const useAudioEngine = () => {
  const isPlaying = useAudioPlayerStore((s) => s.isPlaying);
  const setIsPlaying = useAudioPlayerStore((s) => s.setIsPlaying);
  const setTimeProgress = useAudioPlayerStore((s) => s.setTimeProgress);
  const currentTrackSrc = useAudioPlayerStore((s) => s.currentTrack?.src);
  const volume = useAudioPlayerStore((s) => s.volume);
  const muted = useAudioPlayerStore((s) => s.muted);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted, currentTrackSrc]);

  useEffect(() => {
    const tick = () => {
      if (audioRef.current) {
        setTimeProgress(audioRef.current.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      // play() returns a Promise; browsers (esp. Chrome) reject it
      // when no user gesture has happened yet (autoplay policy).
      // Reset isPlaying so the UI reflects reality.
      audioRef.current?.play().catch(() => {
        setIsPlaying(false);
      });
      rafRef.current = requestAnimationFrame(tick);
    } else {
      audioRef.current?.pause();
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, setTimeProgress, setIsPlaying, currentTrackSrc]);
};

export default useAudioEngine;
