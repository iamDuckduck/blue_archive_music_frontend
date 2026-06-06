import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@mui/material";
import PageHeader from "../Component/PageHeader";
import useAlbumDetails from "../hooks/useAlbumDetails";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { songToTrack } from "../utils/songToTrack";
import { PUBLIC_URL_PREFIX } from "../constants/api";
import type Song from "../entities/Song";

const formatTime = (secs: number): string => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const SongPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const idNum = albumId ? Number(albumId) : undefined;

  const { data: album, isLoading, isError } = useAlbumDetails(idNum);

  const loadQueue = useAudioPlayerStore((s) => s.loadQueue);
  const queue = useAudioPlayerStore((s) => s.queue);
  const queueIndex = useAudioPlayerStore((s) => s.queueIndex);
  const currentTrack = useAudioPlayerStore((s) => s.currentTrack);

  const playFromIndex = (songs: Song[], index: number) => {
    if (songs.length === 0 || idNum === undefined) return;
    const tracks = songs.map((s, i) => songToTrack(s, i, album?.title));
    loadQueue(tracks, {
      source: { kind: "album", albumId: idNum, title: album?.title ?? "" },
      startIndex: index,
      autoplay: true,
    });
  };

  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <section className="shrink-0 pb-6">
          <PageHeader title="Song" clockLabel="System Time" />
        </section>
        <p className="text-sm text-red-500/80 uppercase tracking-wider">
          Failed to load album.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <section className="shrink-0 pb-6">
        <PageHeader title="Song" clockLabel="System Time" />
      </section>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="space-y-8 pb-12">
          {/* Hero */}
          <section className="glass-panel p-6 border border-white/40 tactical-card flex gap-8">
            <div className="w-64 h-64 shrink-0 tactical-album-small overflow-hidden border border-white/20 shadow-xl bg-white/20">
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height="100%" />
              ) : album?.coverImagePath ? (
                <img
                  alt={album.title}
                  src={PUBLIC_URL_PREFIX + album.coverImagePath}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-col justify-end py-2 min-w-0">
              <span className="text-sky-600 font-bold tracking-[0.3em] text-[10px] uppercase mb-2">
                Original Soundtrack
              </span>
              {isLoading ? (
                <Skeleton variant="text" width={320} height={48} />
              ) : (
                <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-4 truncate">
                  {album?.title ?? "—"}
                </h1>
              )}
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                    Composer
                  </span>
                  <span className="text-sm font-bold text-slate-800 uppercase truncate max-w-[200px]">
                    {Array.from(
                      new Set(
                        (album?.songList ?? []).flatMap(
                          (s) => s.composers ?? [],
                        ),
                      ),
                    )
                      .slice(0, 3)
                      .join(", ") || "—"}
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-300" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                    Released
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {album?.releaseDate ?? "—"}
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-300" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                    Tracks
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {album?.songList?.length ?? 0} Songs
                  </span>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  disabled={!album?.songList?.length}
                  onClick={() => album && playFromIndex(album.songList, 0)}
                  className="bg-sky-400 text-white px-8 py-2 font-bold uppercase text-xs flex items-center gap-2 hover:bg-sky-500 transition-all shuffle-button-clip disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    play_arrow
                  </span>{" "}
                  Play All
                </button>
                <button
                  disabled={!album?.songList?.length}
                  onClick={() => {
                    if (!album?.songList?.length) return;
                    const start = Math.floor(
                      Math.random() * album.songList.length,
                    );
                    playFromIndex(album.songList, start);
                  }}
                  className="border border-sky-400/40 text-sky-600 px-8 py-2 font-bold uppercase text-xs flex items-center gap-2 hover:bg-sky-400/10 transition-all shuffle-button-clip disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">
                    shuffle
                  </span>{" "}
                  Shuffle
                </button>
                <button
                  onClick={() => navigate("/library")}
                  className="text-sky-600 px-4 py-2 font-bold uppercase text-xs flex items-center gap-2 hover:bg-sky-400/10 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">
                    arrow_back
                  </span>{" "}
                  Library
                </button>
              </div>
            </div>
          </section>

          {/* Track list */}
          <section className="glass-panel border border-white/40 tactical-card overflow-hidden">
            <div className="grid grid-cols-[48px_1fr_2fr_80px] px-6 py-3 border-b border-white/20 bg-white/20">
              <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">
                #
              </span>
              <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">
                Title
              </span>
              <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">
                Artist
              </span>
              <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest text-right">
                Plays
              </span>
            </div>
            <div className="divide-y divide-white/10">
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[48px_1fr_2fr_80px] px-6 py-4 items-center"
                  >
                    <Skeleton variant="text" width={20} />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width={40} />
                  </div>
                ))}
              {album?.songList?.map((song, i) => {
                const isCurrent =
                  queue.length > 0 &&
                  queueIndex === i &&
                  currentTrack.name === song.title;
                return (
                  <div
                    key={`${song.title}-${i}`}
                    onClick={() => playFromIndex(album.songList, i)}
                    className={`grid grid-cols-[48px_1fr_2fr_80px] px-6 py-4 items-center track-row transition-colors cursor-pointer group ${
                      isCurrent ? "bg-sky-400/10" : ""
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        playFromIndex(album.songList, i);
                      }
                    }}
                  >
                    <span
                      className={`text-xs font-bold ${
                        isCurrent
                          ? "text-sky-600"
                          : "text-slate-400 group-hover:text-sky-600"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-tight truncate">
                      {song.title}
                    </span>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-tighter truncate">
                      {(song.artists ?? []).join(", ")}
                    </span>
                    <span className="text-xs font-bold text-slate-500 text-right">
                      {song.playCount != null
                        ? song.playCount.toLocaleString()
                        : formatTime(0)}
                    </span>
                  </div>
                );
              })}
              {!isLoading && album?.songList?.length === 0 && (
                <div className="px-6 py-8 text-center text-xs text-slate-500 italic">
                  No tracks in this album yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SongPage;
