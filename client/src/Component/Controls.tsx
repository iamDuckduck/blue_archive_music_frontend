import { IconButton, Stack } from "@mui/material";
import { useAudioPlayerContext } from "../context/audio-player-context";
import {
  BsSkipStartFill,
  BsFillRewindFill,
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillFastForwardFill,
  BsSkipEndFill,
  BsShuffle,
  BsRepeat,
} from "react-icons/bs";
import { useCallback, useEffect, useRef, useState } from "react";
import type OstPage from "../entities/OstPage";
import { buildTrackInfo } from "../utils/buildTrackInfo";

const Controls = () => {
  const {
    audioRef,
    currentTrack,
    duration,
    isPlaying,
    setIsPlaying,
    setDuration,
    setTimeProgress,
    trackIndex,
    setTrackIndex,
    setCurrentTrack,
    trackList,
  } = useAudioPlayerContext();
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
    }
  };

  const playAnimationRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (audioRef.current && duration) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
    }
  }, [audioRef, duration, setTimeProgress]);

  // Start animation loop with RAF
  const startAnimation = useCallback(() => {
    if (audioRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef]);

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
      updateProgress();
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
      updateProgress();
    }
  };

  const handleNext = useCallback(() => {
    const newIndex = isShuffle
      ? Math.floor(Math.random() * trackList.length)
      : trackIndex >= trackList.length - 1
      ? 0
      : trackIndex + 1;

    const nextTrack = trackList[newIndex];
    const currentTrackInfo = buildTrackInfo(nextTrack as OstPage);

    setTrackIndex(newIndex);
    setCurrentTrack(currentTrackInfo);
  }, [isShuffle, trackIndex, trackList, setCurrentTrack, setTrackIndex]);

  const handlePrevious = useCallback(() => {
    const newIndex = isShuffle
      ? Math.floor(Math.random() * trackList.length)
      : trackIndex === 0
      ? trackList.length - 1
      : trackIndex - 1;

    const nextTrack = trackList[newIndex];

    const currentTrackInfo = buildTrackInfo(nextTrack as OstPage);

    setTrackIndex(newIndex);
    setCurrentTrack(currentTrackInfo);
  }, [isShuffle, trackIndex, trackList, setCurrentTrack, setTrackIndex]);

  const handleOnEnded = () => {
    if (isRepeat) {
      audioRef.current?.play();
    } else {
      handleNext(); // This function should handle both shuffle and non-shuffle scenarios
    }
  };

  // Effect to handle play/pause and start/stop animation
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startAnimation();
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress(); // Ensure progress is updated immediately when paused
    }
    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, audioRef, startAnimation, updateProgress]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <audio
        src={currentTrack.src}
        ref={audioRef}
        onEnded={handleOnEnded}
        onLoadedMetadata={onLoadedMetadata}
      />
      <IconButton onClick={handlePrevious} size="small">
        <BsSkipStartFill size={20} />
      </IconButton>
      <IconButton onClick={skipBackward} size="small">
        <BsFillRewindFill size={20} />
      </IconButton>
      <IconButton onClick={() => setIsPlaying((prev) => !prev)} size="medium">
        {isPlaying ? (
          <BsFillPauseFill size={30} />
        ) : (
          <BsFillPlayFill size={30} />
        )}
      </IconButton>
      <IconButton onClick={skipForward} size="small">
        <BsFillFastForwardFill size={20} />
      </IconButton>
      <IconButton onClick={handleNext} size="small">
        <BsSkipEndFill size={20} />
      </IconButton>
      <IconButton
        onClick={() => setIsShuffle((prev) => !prev)}
        size="small"
        sx={{ color: isShuffle ? "#f50" : "inherit" }} // text-[#f50] equivalent
      >
        <BsShuffle size={20} />
      </IconButton>
      <IconButton
        onClick={() => setIsRepeat((prev) => !prev)}
        size="small"
        sx={{ color: isRepeat ? "#f50" : "inherit" }} // text-[#f50] equivalent
      >
        <BsRepeat size={20} />
      </IconButton>
    </Stack>
  );
};
export default Controls;
