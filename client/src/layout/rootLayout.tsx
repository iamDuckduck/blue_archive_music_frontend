import { Outlet } from "react-router-dom";
import { useAudioPlayerContext } from "../context/audio-player-context";
import Sidebar from "../Component/Sidebar";
import StatusBar from "../Component/StatusBar";
import useAudioEngine from "../hooks/useAudioEngine";

const RootLayout = () => {
  const { audioRef, currentTrack, setDuration, onTrackEndRef } =
    useAudioPlayerContext();

  useAudioEngine();

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
    }
  };

  const onEnded = () => {
    onTrackEndRef.current?.();
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          alt="Background"
          src="/background.png"
          className="w-full h-full object-cover opacity-95 blur-md"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Persistent Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-48 p-8 h-screen flex flex-col relative z-10 max-w-[calc(100%-12rem)]">
        <Outlet />
      </main>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

export default RootLayout;
