// import { useEffect, useState } from "react";
import HomeMediaPlayer from "../Component/HomeMediaPlayer";
import useRandomSong from "../hooks/useRandomSong";

const Home = () => {
  const { refetch } = useRandomSong();
  const handleRandom = () => {
    refetch();
  };

  // const [time, setTime] = useState("");

  // useEffect(() => {
  //   const updateClock = () => {
  //     const now = new Date();
  //     // UTC+9 (JST)
  //     const utc9 = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  //     const hh = String(utc9.getUTCHours()).padStart(2, "0");
  //     const mm = String(utc9.getUTCMinutes()).padStart(2, "0");
  //     const ss = String(utc9.getUTCSeconds()).padStart(2, "0");
  //     setTime(`${hh}:${mm}:${ss}`);
  //   };
  //   updateClock();
  //   const id = setInterval(updateClock, 1000);
  //   return () => clearInterval(id);
  // }, []);

  return (
    <>
      {/* Welcome Header */}
      <section className="mb-4">
        <div className="flex items-end justify-between border-b border-sky-400/20 pb-4">
          <div>
            <h2 className="text-5xl font-black mt-2 ba-bordered-text">
              Welcome Back, Sensei
            </h2>
          </div>
          <div className="text-right">
            {/* <div className="text-2xl font-light text-slate-800">{time}</div> */}
            <div className="text-[10px] uppercase tracking-tighter text-sky-600 font-bold">
              System Time / UTC+9
            </div>
          </div>
        </div>
      </section>

      {/* Centered Media Player */}
      <section className="flex-1 flex items-center justify-center">
        <HomeMediaPlayer onNext={handleRandom} onPrevious={handleRandom} />
      </section>
    </>
  );
};

export default Home;
