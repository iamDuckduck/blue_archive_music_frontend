import { Box, Paper } from "@mui/material";
import LeftSidePanel from "../Component/LeftSidePanel";
import RightSidePanel from "../Component/RightSidePanel";
const Main = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100dvh",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          height: "600px",
          width: "1200px",
          display: "flex",
          backgroundColor: "#aac3f885",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <LeftSidePanel></LeftSidePanel>
        <RightSidePanel></RightSidePanel>
      </Paper>
    </Box>
  );
};

export default Main;
