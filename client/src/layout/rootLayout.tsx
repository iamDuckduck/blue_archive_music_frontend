import { CardMedia } from "@mui/material";
import { Outlet } from "react-router-dom";
import videoUrl from "../assets/arona.mp4";

// background video loop
const rootLayout = () => {
  const mediaStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none", // Disables user interaction
    zIndex: -1,
    opacity: 0.8,
  };

  return (
    <>
      <CardMedia
        component="video"
        src={videoUrl}
        autoPlay
        muted
        loop
        sx={mediaStyle}
      />
      <Outlet></Outlet>
    </>
  );
};

export default rootLayout;
