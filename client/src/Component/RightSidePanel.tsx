import { Box, Stack, Typography } from "@mui/material";
import { useAudioPlayerContext } from "../context/audio-player-context";
import { PUBLIC_URL_PREFIX } from "../constants/api";
import useOstVolume from "../hooks/useOstVol";
import { AudioPlayerForMain } from "./AudioPlayerForMain";

const RightSidePanel = () => {
  const { currentType } = useAudioPlayerContext();
  const { data } = useOstVolume(currentType.volume);

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#9dbbfb95",
      }}
      width="100%"
      height="600px"
    >
      <Box
        sx={{
          display: "flex",
          p: 4,
        }}
        height="65%"
      >
        {/* image */}
        <Box
          sx={{
            display: "flex",
            flexBasis: "50%",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            sx={{
              objectFit: "contain",
              borderRadius: 2,
            }}
            alt="Image..."
            src={PUBLIC_URL_PREFIX + currentType.image_path}
          />
        </Box>

        {/* volume name + song list */}
        <Box sx={{ flexBasis: "50%" }}>
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Typography variant="h5" sx={{ paddingBottom: 2 }}>
              {currentType.name}
            </Typography>
            <Box sx={{ height: "100%" }}>
              {data?.map((track, index) => (
                <Stack
                  key={index}
                  direction="row"
                  sx={{
                    backgroundColor: "#aac3f8c8",
                    borderRadius: 1,
                    padding: 1,
                    my: 1,
                  }}
                >
                  <Typography width="20%">{index + 1}.</Typography>
                  <Typography width="50%">{track.name}</Typography>
                  <Typography width="30%" textAlign="right">
                    {track.playCount}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" height="100%">
        <Box display="flex" flexDirection="column" sx={{ p: 2 }}>
          <Box alignSelf="center">music Info</Box>
          <Box alignSelf="center">Author</Box>
        </Box>

        <AudioPlayerForMain></AudioPlayerForMain>
      </Box>
    </Box>
  );
};

export default RightSidePanel;
