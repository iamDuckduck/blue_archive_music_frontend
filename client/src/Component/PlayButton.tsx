// components/PlayButton.tsx
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import type { GridRowId } from "@mui/x-data-grid";

interface PlayButtonProps {
  rowId: GridRowId;
  activeRow: GridRowId;
  isPlaying: boolean;
  onClick: (rowId: GridRowId) => void;
}

export const PlayButton = ({
  rowId,
  activeRow,
  isPlaying,
  onClick,
}: PlayButtonProps) => {
  return (
    <IconButton onClick={() => onClick(rowId)}>
      {rowId === activeRow && isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
    </IconButton>
  );
};
