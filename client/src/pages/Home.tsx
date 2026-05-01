import { useEffect } from "react";
import HomeMediaPlayer from "../Component/HomeMediaPlayer";
import PageHeader from "../Component/PageHeader";
import useRandomSong from "../hooks/useRandomSong";
import { useAudioPlayerStore } from "../store/audioPlayerStore";

const Home = () => {
  const { refetch, isFetching } = useRandomSong();
  const setRandomFetcher = useAudioPlayerStore((s) => s.setRandomFetcher);
  const loadQueue = useAudioPlayerStore((s) => s.loadQueue);

  // On mount:
  // - If no source is set yet (very first entry), claim a random source so
  //   onTrackEnded / playNext route to randomFetcher.
  // - If an album/playlist is already loaded, leave it alone — the user
  //   visiting Home shouldn't interrupt their album playback.
  // - Always (re-)register the random fetcher; un-register on unmount so
  //   tracks ending after navigation pause cleanly instead of silently
  //   no-oping.
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

  return (
    <>
      <section className="absolute top-8 left-8 right-8 z-10">
        <PageHeader title="Welcome Back, Sensei" />
      </section>

      <section className="flex-1 flex items-center justify-center">
        <HomeMediaPlayer isLoading={isFetching} />
      </section>
    </>
  );
};

export default Home;
