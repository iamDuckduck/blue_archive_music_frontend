import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import type { GridRowId } from "@mui/x-data-grid";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { audioRef } from "../audio/audioEngine";
import { buildTrackInfo } from "../utils/buildTrackInfo";
import type OstPage from "../entities/OstPage";
import APIClient from "../service/api-client";

interface PlayButtonProps {
  rowId: GridRowId;
}

export const GridPlayButton = ({ rowId }: PlayButtonProps) => {
  const currentTrack = useAudioPlayerStore((s) => s.currentTrack);
  const setCurrentTrack = useAudioPlayerStore((s) => s.setCurrentTrack);
  const trackList = useAudioPlayerStore((s) => s.trackList);
  const setIsPlaying = useAudioPlayerStore((s) => s.setIsPlaying);
  const isPlaying = useAudioPlayerStore((s) => s.isPlaying);

  const apiClient = new APIClient<OstPage>("/user/ost/audio");

  const onClick = (rowId: GridRowId) => {
    audioRef.current?.pause();
    if (rowId === currentTrack.id && isPlaying) {
      setIsPlaying(false);
    } else {
      const targetTrack = trackList.find((track) => track.id == rowId);
      const currentTrackInfo = buildTrackInfo(targetTrack as OstPage);
      // this will make the playcount +1
      apiClient.getAudioOst(currentTrackInfo.id);

      setCurrentTrack(currentTrackInfo);
      setIsPlaying(true);
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
