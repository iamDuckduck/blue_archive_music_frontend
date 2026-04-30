import { Box, IconButton, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdVolumeHigh, IoMdVolumeOff, IoMdVolumeLow } from "react-icons/io";
import { audioRef } from "../audio/audioEngine";

const VolumeControl = () => {
  const [volume, setVolume] = useState<number>(60);
  const [muteVolume, setMuteVolume] = useState(false);

  const handleVolumeChange = (
    _event: React.SyntheticEvent | Event,
    newValue: number
  ) => {
    setVolume(Number(newValue));
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, muteVolume]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "200px" }}>
      <IconButton onClick={() => setMuteVolume((prev) => !prev)}>
        {volume === 0 || muteVolume ? (
          <IoMdVolumeOff fontSize="large" />
        ) : volume < 40 ? (
          <IoMdVolumeLow fontSize="large" />
        ) : (
          <IoMdVolumeHigh fontSize="large" />
        )}
      </IconButton>
      <Slider
        aria-label="Volume"
        value={volume}
        onChange={handleVolumeChange}
        min={0}
        max={100}
        sx={{ width: "120px" }}
      />
    </Box>
  );
};

export default VolumeControl;
