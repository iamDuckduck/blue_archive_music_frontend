import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PUBLIC_URL_PREFIX } from "../constants/api";
import type { SongSearchResult } from "../entities/MusicSearchResponse";
import useMusicSearch from "../hooks/useMusicSearch";
import useSearchAlbumPlayback from "../hooks/useSearchAlbumPlayback";
import useSearchSongPlayback from "../hooks/useSearchSongPlayback";

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal = ({ onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { playAlbum, loadingAlbumId } = useSearchAlbumPlayback();
  const { playSong } = useSearchSongPlayback();
  const { data, isFetching, isError } = useMusicSearch(query);
  const hasQuery = query.trim().length > 0;
  const hasResults =
    (data?.albums.length ?? 0) > 0 || (data?.songs.length ?? 0) > 0;

  const openAlbum = (albumId: number) => {
    onClose();
    navigate(`/library/albums/${albumId}`);
  };

  const handleAlbumPlay = async (albumId: number) => {
    const started = await playAlbum(albumId);
    if (started) {
      onClose();
    }
  };

  const handleSongPlay = (song: SongSearchResult) => {
    playSong(song);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center pl-48 bg-slate-900/25 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Search music"
      onClick={onClose}
    >
      <section
        className="relative w-[min(900px,calc(100vw-16rem))] min-h-[420px] p-10 bg-white/70 backdrop-blur-2xl border border-white/70 shadow-2xl tactical-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-sky-500 transition-colors cursor-pointer"
          aria-label="Close search"
          title="Close"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="mt-8 mr-16">
          <label htmlFor="music-search" className="sr-only">
            Search albums and songs
          </label>
          <div className="h-16 flex items-center gap-4 px-6 bg-white/75 border-2 border-sky-400">
            <span className="material-symbols-outlined text-3xl text-slate-500">
              search
            </span>
            <input
              id="music-search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="flex-1 min-w-0 bg-transparent outline-none text-xl font-bold text-slate-700 placeholder:text-slate-400"
              placeholder="Search albums and songs"
              type="search"
            />
          </div>
        </div>

        <div className="mt-8 h-[250px] overflow-y-auto custom-scrollbar pr-3">
          {hasQuery && isFetching && (
            <div className="h-full flex items-center justify-center gap-3 text-slate-500">
              <span className="material-symbols-outlined animate-spin">
                progress_activity
              </span>
              <p className="text-sm font-bold uppercase">Searching...</p>
            </div>
          )}

          {hasQuery && !isFetching && isError && (
            <div className="h-full flex items-center justify-center text-red-500/80">
              <p className="text-sm font-bold uppercase">
                Search failed. Please try again.
              </p>
            </div>
          )}

          {hasQuery && !isFetching && !isError && data && !hasResults && (
            <div className="h-full flex items-center justify-center text-slate-500">
              <p className="text-sm font-bold uppercase">No results found.</p>
            </div>
          )}

          {hasQuery && !isFetching && !isError && data && hasResults && (
            <div className="space-y-8">
              {data.albums.length > 0 && (
                <section>
                  <h2 className="mb-3 text-xs font-black uppercase text-sky-500">
                    Albums
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {data.albums.map((album) => (
                      <div
                        key={album.id}
                        className="flex min-w-0 items-center gap-4 border-l-4 border-sky-400 bg-white/55 p-3 transition-colors hover:bg-sky-50/80"
                      >
                        <button
                          type="button"
                          onClick={() => handleAlbumPlay(album.id)}
                          disabled={loadingAlbumId !== null}
                          className="group relative h-14 w-14 shrink-0 overflow-hidden cursor-pointer disabled:cursor-wait"
                          aria-label={`Play ${album.title}`}
                          title={`Play ${album.title}`}
                        >
                          <img
                            src={`${PUBLIC_URL_PREFIX}${album.coverImagePath}`}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-slate-900/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                            <span className="material-symbols-outlined">
                              {loadingAlbumId === album.id
                                ? "progress_activity"
                                : "play_arrow"}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openAlbum(album.id)}
                          className="min-w-0 flex-1 truncate text-left font-bold text-slate-700 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-500"
                        >
                          {album.title}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.songs.length > 0 && (
                <section>
                  <h2 className="mb-3 text-xs font-black uppercase text-sky-500">
                    Songs
                  </h2>
                  <div className="space-y-2">
                    {data.songs.map((song) => (
                      <div
                        key={song.id}
                        className="flex min-w-0 items-center gap-4 bg-white/45 p-3 transition-colors hover:bg-sky-50/80"
                      >
                        <button
                          type="button"
                          onClick={() => handleSongPlay(song)}
                          className="group relative h-12 w-12 shrink-0 overflow-hidden cursor-pointer"
                          aria-label={`Play ${song.title}`}
                          title={`Play ${song.title}`}
                        >
                          <img
                            src={`${PUBLIC_URL_PREFIX}${song.imagePath}`}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-slate-900/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                            <span className="material-symbols-outlined">
                              play_arrow
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openAlbum(song.albumId)}
                          className="min-w-0 flex-1 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-500"
                        >
                          <p className="truncate font-bold text-slate-700">
                            {song.title}
                          </p>
                          <p className="truncate text-xs font-semibold uppercase text-slate-500">
                            {song.albumTitle}
                          </p>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchModal;
