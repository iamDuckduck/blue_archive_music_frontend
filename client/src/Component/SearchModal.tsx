import { useEffect, useState } from "react";

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal = ({ onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");

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
      </section>
    </div>
  );
};

export default SearchModal;
