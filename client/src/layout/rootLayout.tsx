import { CardMedia } from "@mui/material";
import { Outlet } from "react-router-dom";
import videoUrl from "../assets/arona.mp4";
import { useAudioPlayerContext } from "../context/audio-player-context";

// background video loop
const RootLayout = () => {
  const { audioRef, currentTrack, setDuration, onTrackEndRef } =
    useAudioPlayerContext();

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) setDuration(seconds);
  };

  const onEnded = () => {
    onTrackEndRef.current?.();
  };

  const mediaStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none", // Disables user interaction
    zIndex: -1,
    opacity: 0.8,
    filter: "blur(4px)",
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
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
      <Outlet></Outlet>
    </>
  );
};

export default RootLayout;
