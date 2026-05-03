import { useEffect } from "react";
import HomeMediaPlayer from "../Component/HomeMediaPlayer";
import PageHeader from "../Component/PageHeader";
import { useAudioPlayerStore } from "../store/audioPlayerStore";

const Home = () => {
  const randomLoading = useAudioPlayerStore((s) => s.randomLoading);
  const loadQueue = useAudioPlayerStore((s) => s.loadQueue);

  // First Home entry claims the random source. The RootLayout-mounted
  // useRandomSongList hook then fetches the initial random queue. If an
  // album/playlist already owns playback, leave it alone.
  useEffect(() => {
    const source = useAudioPlayerStore.getState().source;
    if (!source) {
      loadQueue([], {
        source: { kind: "random" },
        autoplay: false,
      });
    }
  }, [loadQueue]);
  return (
    <>
      <section className="absolute top-8 left-8 right-8 z-10">
        <PageHeader title="Welcome Back, Sensei!" />
      </section>

      <section className="flex-1 flex items-center justify-center">
        <HomeMediaPlayer isLoading={randomLoading} />
      </section>
    </>
  );
};

export default Home;
