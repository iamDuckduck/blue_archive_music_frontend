import { useEffect, useRef } from "react";
import { audioRef } from "../audio/audioEngine";
import { incrementSongPlayCount } from "../service/songPlayCount";
import { useAudioPlayerStore } from "../store/audioPlayerStore";

const PLAY_COUNT_PROGRESS_RATIO = 0.2;
const MAX_PLAY_COUNT_DELAY_SECONDS = 30;

const getPlayCountThreshold = (duration: number) => {
  if (!Number.isFinite(duration) || duration <= 0) {
    return MAX_PLAY_COUNT_DELAY_SECONDS;
  }

  return Math.min(
    MAX_PLAY_COUNT_DELAY_SECONDS,
    duration * PLAY_COUNT_PROGRESS_RATIO,
  );
};

const useSongPlayCount = () => {
  const currentTrack = useAudioPlayerStore((s) => s.currentTrack);
  const playCountResetKey = useAudioPlayerStore((s) => s.playCountResetKey);
  const songId = currentTrack.songId;
  const trackSrc = currentTrack.src;
  const hasCountedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    hasCountedRef.current = false;

    if (!audio || songId === undefined || !trackSrc) return;

    const markPlayed = () => {
      if (hasCountedRef.current) return;

      const threshold = getPlayCountThreshold(audio.duration);
      if (audio.paused || audio.currentTime < threshold) return;

      hasCountedRef.current = true;

      incrementSongPlayCount(songId).catch((error: unknown) => {
        console.error("Failed to increment song play count", error);
      });
    };

    const resetPlayCountEligibility = () => {
      hasCountedRef.current = false;
    };

    audio.addEventListener("timeupdate", markPlayed);
    audio.addEventListener("ended", resetPlayCountEligibility);

    return () => {
      audio.removeEventListener("timeupdate", markPlayed);
      audio.removeEventListener("ended", resetPlayCountEligibility);
    };
  }, [playCountResetKey, songId, trackSrc]);
};

export default useSongPlayCount;
