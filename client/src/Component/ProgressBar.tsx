import { Box, Slider, styled, Typography } from "@mui/material";
import { useState } from "react";
import { useAudioPlayerContext } from "../context/audio-player-context";

const ProgressBar = () => {
  const TinyText = styled(Typography)({
    fontSize: "0.75rem",
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
  });

  const handleProgressChange = () => {
    if (audioRef.current) setPosition(audioRef.current.currentTime);
  };

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  const { audioRef, duration } = useAudioPlayerContext();

  const [position, setPosition] = useState(0);
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      gap={5}
    >
      <TinyText>{formatDuration(position)}</TinyText>

      <Slider
        sx={{
          maxWidth: "80%",
        }}
        defaultValue={position}
        step={1} // For second-level precision
        onChange={handleProgressChange}
      />
      <TinyText>-{formatDuration(duration - position)}</TinyText>
    </Box>
  );
};

export default ProgressBar;
