import type { GridRowId } from "@mui/x-data-grid";
import { useRef, useState } from "react";
import { OST_AUDIO_ENDPOINT } from "../config/api";

const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeRow, setActiveRow] = useState<GridRowId>("");
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = async (rowId: GridRowId) => {
    try {
      const response = await fetch(`${OST_AUDIO_ENDPOINT}/${rowId}`);
      const url = await response.text();
      setAudioUrl(url);
    } catch (error) {
      console.error("Failed to fetch audio:", error);
    }
  };

  const handlePlayButtonClick = (rowId: GridRowId) => {
    if (!isPlaying) {
      setActiveRow(rowId);
      setIsPlaying(true);
      playAudio(rowId);
    } else if (rowId === activeRow) {
      setIsPlaying(false);
      setActiveRow("");
      audioRef.current?.pause();
    } else {
      setActiveRow(rowId);
      playAudio(rowId);
    }
  };

  return {
    isPlaying,
    activeRow,
    audioUrl,
    audioRef,
    setActiveRow,
    handlePlayButtonClick,
  };
};

export default useAudioPlayer;
