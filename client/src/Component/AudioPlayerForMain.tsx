import TrackInfo from "./TrackInfo";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import { Box } from "@mui/material";

export const AudioPlayerForMain = () => {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          minHeight: "32px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          color: "white",
          px: 2,
        }}
      >
        <TrackInfo />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Controls />
          <ProgressBar />
        </Box>

        <VolumeControl />
      </Box>
    </Box>
  );
};
