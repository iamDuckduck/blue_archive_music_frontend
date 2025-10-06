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
import { useEffect, useState } from "react";

const Controls = () => {
  const { audioRef, currentTrack, isPlaying, setIsPlaying } =
    useAudioPlayerContext();
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // url is a cached url so depending isPlaying alone causes bug
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack.src) return;

    if (isPlaying) {
      audio.play();
    }

    return () => {
      audio.pause();
    };
  }, [isPlaying, currentTrack, audioRef]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <audio
        src={currentTrack.src}
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
      />
      <IconButton onClick={() => {}} size="small">
        <BsSkipStartFill size={20} />
      </IconButton>
      <IconButton onClick={() => {}} size="small">
        <BsFillRewindFill size={20} />
      </IconButton>
      <IconButton onClick={() => setIsPlaying((prev) => !prev)} size="medium">
        {isPlaying ? (
          <BsFillPauseFill size={30} />
        ) : (
          <BsFillPlayFill size={30} />
        )}
      </IconButton>
      <IconButton onClick={() => {}} size="small">
        <BsFillFastForwardFill size={20} />
      </IconButton>
      <IconButton onClick={() => {}} size="small">
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
