import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import homePageIcon from "../assets/arona.png";

const NavBar = () => {
  const appBarStyle = {
    backgroundColor: "rgba(85, 202, 242, 0.67)", // Light blue with transparency
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  };

  const iconImgStyle = {
    width: 48,
    height: 48,
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" sx={appBarStyle}>
        <Toolbar>
          <IconButton sx={{ mr: 2 }}>
            <img src={homePageIcon} alt="home page icon" style={iconImgStyle} />
          </IconButton>
          <Typography variant="h6" component="div">
            OST
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
