import { useAudioPlayerContext } from "../context/audio-player-context";

const StatusBar = () => {
  const { currentType, currentTrack } = useAudioPlayerContext();

  const nowPlaying =
    currentTrack?.name || currentType?.name || "Standby";

  return (
    <footer className="fixed bottom-0 right-0 w-[calc(100%-12rem)] z-50 flex justify-end items-center px-12 h-10 bg-white/20 backdrop-blur-md border-t border-white/30">
      <div className="flex gap-4 items-center">
        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <div className="text-[9px] font-bold text-slate-800 uppercase tracking-widest">
          Now Playing · {nowPlaying}
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
