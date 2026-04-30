import { useEffect } from "react";
import HomeMediaPlayer from "../Component/HomeMediaPlayer";
import PageHeader from "../Component/PageHeader";
import useRandomSong from "../hooks/useRandomSong";
import { onTrackEndRef } from "../audio/audioEngine";

const Home = () => {
  const { refetch, isFetching } = useRandomSong();

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
  }, [refetch]);

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
