import { useEffect, useMemo, useState } from "react";
import HomeMediaPlayer from "../Component/HomeMediaPlayer";
import useRandomSong from "../hooks/useRandomSong";
import { useAudioPlayerContext } from "../context/audio-player-context";

const Home = () => {
  const { refetch } = useRandomSong();
  const { onTrackEndRef } = useAudioPlayerContext();

  const handleRandom = () => {
    refetch();
  };

  // Track-end policy on the Home page: auto-play another random song.
  // Registered into the shared mailbox so RootLayout's <audio onEnded>
  // can dispatch to it. Other pages (e.g. OST with Controls) will
  // register their own handler instead.
  useEffect(() => {
    onTrackEndRef.current = () => {
      refetch();
    };
    return () => {
      onTrackEndRef.current = null;
    };
  }, [refetch, onTrackEndRef]);

  const [time, setTime] = useState("");

  // Computed once: user's UTC offset label, e.g. "UTC+8" or "UTC-5:30"
  const tzLabel = useMemo(() => {
    const offsetMin = -new Date().getTimezoneOffset(); // minutes east of UTC
    const sign = offsetMin >= 0 ? "+" : "-";
    const abs = Math.abs(offsetMin);
    const hh = Math.floor(abs / 60);
    const mm = abs % 60;
    return mm === 0
      ? `UTC${sign}${hh}`
      : `UTC${sign}${hh}:${String(mm).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <section className="absolute top-8 left-8 right-8 z-10">
        <div className="flex items-end justify-between border-b border-sky-400/20 pb-4">
          <div>
            <h2 className="text-5xl font-black mt-2 ba-bordered-text">
              Welcome Back, Sensei
            </h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-light text-slate-800">{time}</div>
            <div className="text-[10px] uppercase tracking-tighter text-sky-600 font-bold">
              Local Time / {tzLabel}
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center">
          <HomeMediaPlayer onNext={handleRandom} onPrevious={handleRandom} />
      </section>
    </>
  );
};

export default Home;
