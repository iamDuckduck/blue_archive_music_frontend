import { useEffect } from "react";
import HomeMediaPlayer from "../Component/HomeMediaPlayer";
import PageHeader from "../Component/PageHeader";
import useRandomSong from "../hooks/useRandomSong";
import { useAudioPlayerStore } from "../store/audioPlayerStore";

const Home = () => {
  const { refetch, isFetching } = useRandomSong();
  const setRandomFetcher = useAudioPlayerStore((s) => s.setRandomFetcher);
  const loadQueue = useAudioPlayerStore((s) => s.loadQueue);

  // On mount: claim the random source if no album/playlist is currently
  // loaded, and register `refetch` as the store's randomFetcher so
  // onTrackEnded / playNext can request the next random track. On unmount,
  // un-register the fetcher (any in-flight random ended events will then
  // pause cleanly instead of silently no-oping).
  useEffect(() => {
    const source = useAudioPlayerStore.getState().source;
    if (!source || source.kind === "random") {
      loadQueue([], { source: { kind: "random" }, autoplay: false });
    }
    setRandomFetcher(() => {
      refetch();
    });
    return () => {
      setRandomFetcher(null);
    };
  }, [refetch, setRandomFetcher, loadQueue]);

  const handleRandom = () => {
    refetch();
  };

  return (
    <>
      <section className="absolute top-8 left-8 right-8 z-10">
        <PageHeader title="Welcome Back, Sensei" />
      </section>

      <section className="flex-1 flex items-center justify-center">
          <HomeMediaPlayer
            onNext={handleRandom}
            onPrevious={handleRandom}
            isLoading={isFetching}
          />
      </section>
    </>
  );
};

export default Home;
