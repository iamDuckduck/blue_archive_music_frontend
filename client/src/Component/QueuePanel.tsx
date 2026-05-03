import { useAudioPlayerStore } from "../store/audioPlayerStore";

interface QueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueuePanel = ({ isOpen, onClose }: QueuePanelProps) => {
  const queue = useAudioPlayerStore((s) => s.queue);
  const queueIndex = useAudioPlayerStore((s) => s.queueIndex);
  const currentTrack = useAudioPlayerStore((s) => s.currentTrack);
  const shuffledOrder = useAudioPlayerStore((s) => s.shuffledOrder);
  const shuffle = useAudioPlayerStore((s) => s.shuffle);

  if (!isOpen) return null;

  // Respect shuffle order when computing next-up list.
  const order =
    shuffle === "on" && shuffledOrder
      ? shuffledOrder
      : queue.map((_, i) => i);
  const cursorInOrder = Math.max(0, order.indexOf(queueIndex));
  const nextTracks = order.slice(cursorInOrder + 1).map((idx) => queue[idx]);

  return (
    <div
      className="fixed bottom-[6.5rem] right-4 w-80 max-h-[480px] flex flex-col z-60 glass-panel border border-white/40 shadow-2xl"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 96%, 94% 100%, 0 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sky-500 text-lg">
            queue_music
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Queue
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-sky-500 transition-colors cursor-pointer"
          aria-label="Close queue"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-1">
        {/* Now Playing section */}
        <div className="px-4 pt-3 pb-2 shrink-0">
          <span className="text-[8px] font-black uppercase tracking-widest text-white bg-sky-400 px-2 py-0.5 shuffle-button-clip">
            Now Playing
          </span>
        </div>

        {currentTrack?.src ? (
          <div className="px-4 pb-3 flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 tactical-album-small bg-sky-950/20 border border-white/30 overflow-hidden flex items-center justify-center">
              {currentTrack.thumbnail ? (
                <img
                  src={currentTrack.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-sm text-white/40">
                  music_note
                </span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black uppercase tracking-tight text-slate-800 truncate">
                {currentTrack.name}
              </span>
              <span className="text-[9px] font-bold text-sky-600 uppercase tracking-wider truncate">
                {currentTrack.author}
              </span>
            </div>
            {/* Equaliser icon signals active playback */}
            <span
              className="material-symbols-outlined text-sky-400 text-base ml-auto shrink-0"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              graphic_eq
            </span>
          </div>
        ) : (
          <p className="px-4 pb-3 text-[9px] text-slate-400 uppercase tracking-wider">
            Nothing playing
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-white/20 mx-4" />

        {/* Next Up section */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-2 shrink-0">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
            Next Up
          </span>
          <span className="text-[8px] font-bold text-slate-400">
            ({nextTracks.length})
          </span>
        </div>

        {nextTracks.length === 0 ? (
          <p className="px-4 pb-4 text-[9px] text-slate-400 uppercase tracking-wider">
            End of queue
          </p>
        ) : (
          <div className="pb-2">
            {nextTracks.map((track, i) => (
              <div
                key={`${track.id}-${i}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-sky-400/5 transition-colors"
              >
                <span className="text-[9px] font-bold text-slate-400 w-4 shrink-0 text-right">
                  {i + 1}
                </span>
                <div className="w-8 h-8 shrink-0 tactical-album-small bg-sky-950/20 border border-white/20 overflow-hidden flex items-center justify-center">
                  {track.thumbnail ? (
                    <img
                      src={track.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-xs text-white/30">
                      music_note
                    </span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-700 truncate">
                    {track.name}
                  </span>
                  <span className="text-[8px] font-bold text-sky-600/70 uppercase tracking-wider truncate">
                    {track.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueuePanel;
