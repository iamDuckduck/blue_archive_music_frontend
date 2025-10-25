import { Box, Paper } from "@mui/material";
import LeftSidePanel from "../Component/LeftSidePanel";
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
        elevation={3}
        sx={{
          height: "600px",
          width: "1200px",
          display: "flex",
          background: "linear-gradient(135deg, #f5e1f7 0%, #a3c6ff 100%)",
          borderRadius: 2,
        }}
      >
        <LeftSidePanel></LeftSidePanel>

        <Box
          sx={{
            flexGrow: 1,
            p: 10,
          }}
          width="100%"
          borderRadius="10px"
        >
          <Box sx={{ display: "flex" }} height="80%">
            <Box sx={{ flexBasis: "50%" }}>image</Box>
            <Box sx={{ flexBasis: "50%" }}>list</Box>
          </Box>
          <Box>audio</Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Main;
