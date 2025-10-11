import { Box, Slider, styled, Typography } from "@mui/material";
import { useAudioPlayerContext } from "../context/audio-player-context";

const ProgressBar = () => {
  const TinyText = styled(Typography)({
    fontSize: "0.75rem",
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
  });

  const handleProgressChange = (
    _event: React.SyntheticEvent | Event,
    newValue: number
  ) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
    }
    setTimeProgress(newValue);
  };

  const formatDuration = (time: number | undefined): string => {
    if (typeof time === "number" && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      // Convert to string and pad with leading zeros if necessary
      const formatMinutes = minutes.toString().padStart(2, "0");
      const formatSeconds = seconds.toString().padStart(2, "0");
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  const { audioRef, duration, timeProgress, setTimeProgress } =
    useAudioPlayerContext();
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      gap={5}
    >
      <TinyText>{formatDuration(timeProgress)}</TinyText>

      <Slider
        sx={{
          maxWidth: "80%",
        }}
        defaultValue={0}
        step={1} // For second-level precision
        onChange={handleProgressChange}
        value={Math.floor(timeProgress)}
        min={0}
        max={duration}
      />
      <TinyText>-{formatDuration(duration - timeProgress)}</TinyText>
    </Box>
  );
};

export default ProgressBar;
