import { IconButton, Stack } from "@mui/material";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { audioRef, onTrackEndRef } from "../audio/audioEngine";
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
import { useCallback, useEffect, useState } from "react";
import type OstPage from "../entities/OstPage";
import { buildTrackInfo } from "../utils/buildTrackInfo";

const Controls = () => {
  const isPlaying = useAudioPlayerStore((s) => s.isPlaying);
  const setIsPlaying = useAudioPlayerStore((s) => s.setIsPlaying);
  const setTimeProgress = useAudioPlayerStore((s) => s.setTimeProgress);
  const trackIndex = useAudioPlayerStore((s) => s.trackIndex);
  const setTrackIndex = useAudioPlayerStore((s) => s.setTrackIndex);
  const setCurrentTrack = useAudioPlayerStore((s) => s.setCurrentTrack);
  const trackList = useAudioPlayerStore((s) => s.trackList);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
      setTimeProgress(audioRef.current.currentTime);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
      setTimeProgress(audioRef.current.currentTime);
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

  const handleOnEnded = useCallback(() => {
    if (isRepeat) {
      audioRef.current?.play();
    } else {
      handleNext();
    }
  }, [isRepeat, audioRef, handleNext]);

  // Register onEnded handler in context so RootLayout's <audio> can call it
  useEffect(() => {
    onTrackEndRef.current = handleOnEnded;
    return () => {
      onTrackEndRef.current = null;
    };
  }, [handleOnEnded, onTrackEndRef]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
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
