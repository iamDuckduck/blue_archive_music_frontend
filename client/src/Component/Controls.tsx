import { useAudioPlayerContext } from "../context/audio-player-context";

const Controls = () => {
  const { currentTrack } = useAudioPlayerContext();
  return (
    <div>
      <audio src={currentTrack.src} controls />
    </div>
  );
};

export default Controls;
