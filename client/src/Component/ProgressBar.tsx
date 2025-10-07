import { Box, Slider } from "@mui/material";

const ProgressBar = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="100%"
    gap={5} // gap-5 equivalent
  >
    <span>00:00</span>
    <Slider
      sx={{
        maxWidth: "80%",
        color: "primary",
      }}
    />
    <span>03:34</span>
  </Box>
);

export default ProgressBar;
