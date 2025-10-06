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
import { useState } from "react";

const Controls = () => {
  const { currentTrack } = useAudioPlayerContext();
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <audio src={currentTrack.src} />
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
