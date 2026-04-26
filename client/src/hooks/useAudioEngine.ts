import { useEffect, useRef } from "react";
import { useAudioPlayerContext } from "../context/audio-player-context";

/**
 * Single source of truth for audio playback side-effects.
 * Mounted once in RootLayout (where <audio> lives).
 *
 *  - Reacts to `isPlaying` to play/pause the <audio> element.
 *  - Drives a requestAnimationFrame loop that mirrors
 *    audio.currentTime into the `timeProgress` context state.
 *
 * UI components (Controls, HomeMediaPlayer, etc.) are pure consumers:
 * they read state and dispatch via setIsPlaying / seek, but never
 * touch RAF or play()/pause() directly.
 */
const useAudioEngine = () => {
  const { audioRef, isPlaying, setTimeProgress } = useAudioPlayerContext();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      if (audioRef.current) {
        setTimeProgress(audioRef.current.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      audioRef.current?.play();
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
  }, [isPlaying, audioRef, setTimeProgress]);
};

export default useAudioEngine;
