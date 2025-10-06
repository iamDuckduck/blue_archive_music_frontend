// components/PlayButton.tsx
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import type { GridRowId } from "@mui/x-data-grid";
import { useAudioPlayerContext } from "../context/audio-player-context";
import { OST_AUDIO_ENDPOINT } from "../config/api";

interface PlayButtonProps {
  rowId: GridRowId;
}

export const GridPlayButton = ({ rowId }: PlayButtonProps) => {
  const {
    audioRef,
    currentTrack,
    setCurrentTrack,
    trackList,
    setIsPlaying,
    isPlaying,
  } = useAudioPlayerContext();

  const fetchAudio = async (rowId: GridRowId) => {
    try {
      const response = await fetch(`${OST_AUDIO_ENDPOINT}/${rowId}`);
      return await response.text();
    } catch (error) {
      console.error("Failed to fetch audio:", error);
    }
  };

  const onClick = async (rowId: GridRowId) => {
    audioRef.current?.pause();
    if (rowId === currentTrack.id && isPlaying) {
      setIsPlaying(false);
    } else {
      const targetTrack = trackList.find((track) => track.id == rowId);
      setIsPlaying(true);
      const url = await fetchAudio(rowId);
      setCurrentTrack({
        id: targetTrack?.id || 0,
        name: targetTrack?.name || "",
        src: url || "",
        author: targetTrack?.author || "",
        thumbnail: "string",
      });
    }
  };

  return (
    <IconButton onClick={() => onClick(rowId)}>
      {rowId === currentTrack.id && isPlaying ? (
        <PauseIcon />
      ) : (
        <PlayArrowIcon />
      )}
    </IconButton>
  );
};
