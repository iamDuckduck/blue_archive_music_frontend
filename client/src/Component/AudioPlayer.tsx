import TrackInfo from "./TrackInfo";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import { Box } from "@mui/material";

export const AudioPlayer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Box
        sx={{
          minHeight: "32px",
          backgroundColor: "#2e2d2d",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          color: "white",
          padding: "8px 10px",
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
