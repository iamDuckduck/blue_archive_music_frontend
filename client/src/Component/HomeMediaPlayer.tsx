import { useRef, useState } from "react";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { audioRef } from "../audio/audioEngine";
import { buildTrackInfo } from "../utils/buildTrackInfo";
import type OstPage from "../entities/OstPage";

const VOLUME_STEPS = 8;

const formatTime = (secs: number): string => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

interface HomeMediaPlayerProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

const HomeMediaPlayer = ({ onNext, onPrevious }: HomeMediaPlayerProps = {}) => {
  const currentTrack = useAudioPlayerStore((s) => s.currentTrack);
  const currentType = useAudioPlayerStore((s) => s.currentType);
  const isPlaying = useAudioPlayerStore((s) => s.isPlaying);
  const setIsPlaying = useAudioPlayerStore((s) => s.setIsPlaying);
  const duration = useAudioPlayerStore((s) => s.duration);
  const timeProgress = useAudioPlayerStore((s) => s.timeProgress);
  const setTimeProgress = useAudioPlayerStore((s) => s.setTimeProgress);
  const trackIndex = useAudioPlayerStore((s) => s.trackIndex);
  const setTrackIndex = useAudioPlayerStore((s) => s.setTrackIndex);
  const setCurrentTrack = useAudioPlayerStore((s) => s.setCurrentTrack);
  const trackList = useAudioPlayerStore((s) => s.trackList);
  const volume = useAudioPlayerStore((s) => s.volume);
  const setVolume = useAudioPlayerStore((s) => s.setVolume);

  /* ─── Volume (segmented bars) ─── */
  const volumeLevel = Math.round(volume * VOLUME_STEPS);

  const handleVolumeClick = (level: number) => {
    // Clicking the currently-active top bar mutes (sets to 0).
    const next = level === volumeLevel ? 0 : level;
    setVolume(next / VOLUME_STEPS);
  };

  /* ─── Seek ─── */
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

  /* ─── Next / Previous ─── */
  const handleNext = () => {
    if (onNext) {
      onNext();
      return;
    }
    if (!trackList || trackList.length === 0) return;
    const newIndex =
      trackIndex >= trackList.length - 1 ? 0 : trackIndex + 1;
    const next = trackList[newIndex];
    setTrackIndex(newIndex);
    setCurrentTrack(buildTrackInfo(next as OstPage));
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
      return;
    }
    if (!trackList || trackList.length === 0) return;
    const newIndex =
      trackIndex === 0 ? trackList.length - 1 : trackIndex - 1;
    const prev = trackList[newIndex];
    setTrackIndex(newIndex);
    setCurrentTrack(buildTrackInfo(prev as OstPage));
  };

  const progressPercent = duration > 0 ? (timeProgress / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-8 bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-white/20 shadow-2xl pointer-events-auto">
      {/* Album Art */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-1 bg-sky-400/20 rounded-lg blur-sm" />
        <div className="relative w-64 h-64 rounded-lg overflow-hidden border-2 border-white/40 tactical-album-small shadow-lg">
          {currentTrack?.thumbnail ? (
            <img
              alt="Album Art"
              src={currentTrack.thumbnail}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-sky-950/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-white/40">
                music_note
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Player Controls & Info */}
      <div className="w-[500px] flex flex-col justify-between">
        {/* Top row: track info + volume */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-sky-400 text-white text-[9px] font-black uppercase tracking-widest shuffle-button-clip">
                Current Album
              </span>
              <span className="text-sky-600 font-bold text-[10px] uppercase tracking-widest">
                {currentType?.name || ""}
              </span>
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tight ba-bordered-text">
              {currentTrack?.name || "—"}
            </h3>
            <p className="text-sky-600 font-bold text-sm uppercase tracking-widest mt-1">
              {currentTrack?.author || ""}
            </p>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-slate-600">
              {volumeLevel === 0
                ? "volume_off"
                : volumeLevel <= 3
                ? "volume_down"
                : "volume_up"}
            </span>
            <div className="w-24 h-2 flex items-center gap-0.5">
              {Array.from({ length: VOLUME_STEPS }, (_, i) => i + 1).map((level) => (
                <button
                  key={level}
                  onClick={() => handleVolumeClick(level)}
                  className={`h-full flex-1 cursor-pointer transition-colors ${
                    level <= volumeLevel ? "bg-sky-400" : "bg-sky-400/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Playback controls */}
        <div className="mt-8">
          <div className="flex items-center gap-6 mb-4">
            <button
              onClick={handlePrevious}
              className="text-slate-600 hover:text-sky-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-3xl">
                skip_previous
              </span>
            </button>
            <button
              onClick={() => setIsPlaying((prev) => !prev)}
              className="text-white bg-sky-400 w-14 h-14 flex items-center justify-center rounded-lg shadow-lg hover:bg-sky-500 transition-all cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>
            <button
              onClick={handleNext}
              className="text-slate-600 hover:text-sky-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-3xl">
                skip_next
              </span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-800 w-10 text-right">
              {formatTime(timeProgress)}
            </span>
            <div
              ref={progressBarRef}
              className="flex-1 h-1 bg-sky-950/10 relative cursor-pointer"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <div
                className="absolute inset-y-0 left-0 bg-sky-400"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 diamond-handle" />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-800 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMediaPlayer;
