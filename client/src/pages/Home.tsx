import Box from "@mui/material/Box";
import { Button, Fade, Stack, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const boxStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  };

  const navigate = useNavigate();
  return (
    <Box sx={boxStyle}>
      <Fade in={true} timeout={3000}>
        <Stack
          sx={{
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <Typography variant="h1">Blue Archive OST</Typography>

          <Button
            variant="contained"
            size="small"
            sx={{
              opacity: 0.9,
              padding: 1.5,
            }}
            onClick={() => {
              navigate("/main");
            }}
          >
            Click here to play
          </Button>
        </Stack>
      </Fade>
    </Box>
  );
};

export default Home;
