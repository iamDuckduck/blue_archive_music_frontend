import { useRef, useState } from "react";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { audioRef } from "../audio/audioEngine";

const VOLUME_STEPS = 8;

const formatTime = (secs: number): string => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const BottomMediaBar = () => {
  const currentTrack = useAudioPlayerStore((s) => s.currentTrack);
  const isPlaying = useAudioPlayerStore((s) => s.isPlaying);
  const setIsPlaying = useAudioPlayerStore((s) => s.setIsPlaying);
  const duration = useAudioPlayerStore((s) => s.duration);
  const timeProgress = useAudioPlayerStore((s) => s.timeProgress);
  const setTimeProgress = useAudioPlayerStore((s) => s.setTimeProgress);
  const volume = useAudioPlayerStore((s) => s.volume);
  const setVolume = useAudioPlayerStore((s) => s.setVolume);
  const queue = useAudioPlayerStore((s) => s.queue);
  const queueIndex = useAudioPlayerStore((s) => s.queueIndex);
  const setQueueIndex = useAudioPlayerStore((s) => s.setQueueIndex);
  const setCurrentTrack = useAudioPlayerStore((s) => s.setCurrentTrack);

  const hasQueue = queue.length > 0;

  const goTo = (index: number) => {
    if (!hasQueue) return;
    const wrapped = (index + queue.length) % queue.length;
    setQueueIndex(wrapped);
    setCurrentTrack(queue[wrapped]);
    setIsPlaying(true);
  };

  const handlePrev = () => goTo(queueIndex - 1);
  const handleNext = () => goTo(queueIndex + 1);

  const volumeLevel = Math.round(volume * VOLUME_STEPS);

  const handleVolumeClick = (level: number) => {
    const next = level === volumeLevel ? 0 : level;
    setVolume(next / VOLUME_STEPS);
  };

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const seek = (clientX: number) => {
    const bar = progressBarRef.current;
    if (!bar || !audioRef.current) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setTimeProgress(newTime);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    seek(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging) seek(e.clientX);
  };

  const onPointerUp = () => {
    setIsDragging(false);
  };

  const progressPercent = duration > 0 ? (timeProgress / duration) * 100 : 0;
  const hasTrack = !!currentTrack?.src;

  return (
    <section className="fixed bottom-0 left-48 right-0 h-24 z-50 px-8 py-3 glass-panel border-t border-white/40 flex items-center justify-between">
      {/* Left: album art + track info */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded overflow-hidden border border-white/40 tactical-album-small bg-sky-950/20 flex items-center justify-center">
            {currentTrack?.thumbnail ? (
              <img
                alt="Now Playing"
                src={currentTrack.thumbnail}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-3xl text-white/50">
                music_note
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-1.5 py-0.5 bg-sky-400 text-white text-[7px] font-black uppercase tracking-widest shuffle-button-clip">
              Now Playing
            </span>
            <span className="text-sky-600 font-bold text-[9px] uppercase tracking-widest truncate">
              {currentTrack?.albumTitle || "—"}
            </span>
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 truncate">
            {currentTrack?.name || "Standby"}
          </h3>
          <p className="text-sky-600 font-bold text-[10px] uppercase tracking-widest truncate">
            {currentTrack?.author || ""}
          </p>
        </div>
      </div>

      {/* Middle: transport + progress */}
      <div className="flex flex-col items-center gap-2 px-12 border-x border-white/20 flex-1 max-w-2xl">
        <div className="flex items-center gap-6">
          <button
            disabled={!hasQueue}
            onClick={handlePrev}
            className="text-slate-600 hover:text-sky-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Previous"
          >
            <span className="material-symbols-outlined text-2xl">
              skip_previous
            </span>
          </button>
          <button
            disabled={!hasTrack}
            onClick={() => setIsPlaying((p) => !p)}
            className="text-white bg-sky-400 w-10 h-10 flex items-center justify-center rounded-lg shadow-lg hover:bg-sky-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>
          <button
            disabled={!hasQueue}
            onClick={handleNext}
            className="text-slate-600 hover:text-sky-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Next"
          >
            <span className="material-symbols-outlined text-2xl">
              skip_next
            </span>
          </button>
        </div>
        <div className="flex items-center gap-4 w-full">
          <span className="text-[9px] font-bold text-slate-800 w-10 text-right">
            {formatTime(timeProgress)}
          </span>
          <div
            ref={progressBarRef}
            className="flex-1 h-1 bg-sky-950/10 relative cursor-pointer"
            onPointerDown={hasTrack ? onPointerDown : undefined}
            onPointerMove={hasTrack ? onPointerMove : undefined}
            onPointerUp={hasTrack ? onPointerUp : undefined}
          >
            <div
              className="absolute inset-y-0 left-0 bg-sky-400"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 diamond-handle" />
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-800 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: queue + volume */}
      <div className="flex items-center gap-6 flex-1 justify-end">
        <button
          className="text-slate-600 hover:text-sky-600 transition-all flex flex-col items-center cursor-pointer disabled:opacity-40"
          disabled
          aria-label="Queue"
          title="Queue (coming soon)"
        >
          <span className="material-symbols-outlined text-xl">
            queue_music
          </span>
          <span className="text-[8px] uppercase font-bold">Queue</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-slate-600">
            {volumeLevel === 0
              ? "volume_off"
              : volumeLevel <= 3
                ? "volume_down"
                : "volume_up"}
          </span>
          <div className="w-24 h-2 flex items-center gap-0.5">
            {Array.from({ length: VOLUME_STEPS }, (_, i) => i + 1).map(
              (level) => (
                <button
                  key={level}
                  onClick={() => handleVolumeClick(level)}
                  className={`h-full flex-1 cursor-pointer transition-colors ${
                    level <= volumeLevel ? "bg-sky-400" : "bg-sky-400/20"
                  }`}
                  aria-label={`Volume ${level}/${VOLUME_STEPS}`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomMediaBar;
