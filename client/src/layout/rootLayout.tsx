import { Outlet, useLocation } from "react-router-dom";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { audioRef } from "../audio/audioEngine";
import Sidebar from "../Component/Sidebar";
import BottomMediaBar from "../Component/BottomMediaBar";
import useAudioEngine from "../hooks/useAudioEngine";
import StatusBar from "../Component/StatusBar";

const RootLayout = () => {
  const currentTrack = useAudioPlayerStore((s) => s.currentTrack);
  const setDuration = useAudioPlayerStore((s) => s.setDuration);
  const onTrackEnded = useAudioPlayerStore((s) => s.onTrackEnded);
  const location = useLocation();

  useAudioEngine();

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
    }
  };

  // Home renders its own centered HomeMediaPlayer as the primary UI;
  // every other route gets the fixed compact BottomMediaBar instead.
  const isHome = location.pathname === "/";

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
        onEnded={onTrackEnded}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`ml-48 p-8 h-screen flex flex-col relative z-10 max-w-[calc(100%-12rem)] ${
          isHome ? "pb-12" : "pb-32"
        }`}
      >
        <Outlet />
      </main>

      {/* Bottom Media Bar (hidden on Home) */}
      {!isHome ? <BottomMediaBar /> : <StatusBar />}
    </div>
  );
};

export default RootLayout;
