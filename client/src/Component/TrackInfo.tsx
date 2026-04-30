import { Box, Typography } from "@mui/material";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { BsMusicNoteBeamed } from "react-icons/bs";

const TrackInfo = () => {
  const currentTrack = useAudioPlayerStore((s) => s.currentTrack);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={{
          width: 96,
          height: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.200",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {currentTrack.thumbnail ? (
          <img
            src={currentTrack.thumbnail}
            alt="audio avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              bgcolor: "grey.300",
              borderRadius: 1,
            }}
          >
            <BsMusicNoteBeamed
              style={{ fontSize: "1.25rem", color: "grey.600" }}
            />
          </Box>
        )}
      </Box>
      <Box>
        <Typography
          sx={{
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { xs: "100%", lg: 256 },
          }}
        >
          {currentTrack.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentTrack.author}
        </Typography>
      </Box>
    </Box>
  );
};

export default TrackInfo;
