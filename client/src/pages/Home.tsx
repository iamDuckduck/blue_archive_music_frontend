import HomeMediaPlayer from "../Component/HomeMediaPlayer";
import PageHeader from "../Component/PageHeader";
import { useAudioPlayerStore } from "../store/audioPlayerStore";

const Home = () => {
  const randomLoading = useAudioPlayerStore((s) => s.randomLoading);

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
