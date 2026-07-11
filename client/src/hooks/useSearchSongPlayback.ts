import { PUBLIC_URL_PREFIX } from "../constants/api";
import type { SongSearchResult } from "../entities/MusicSearchResponse";
import { useAudioPlayerStore, type Track } from "../store/audioPlayerStore";

const useSearchSongPlayback = () => {
  const loadQueue = useAudioPlayerStore((state) => state.loadQueue);

  const playSong = (song: SongSearchResult) => {
    const track: Track = {
      id: 0,
      songId: song.id,
      name: song.title,
      src: PUBLIC_URL_PREFIX + song.audioPath,
      author: "",
      thumbnail: PUBLIC_URL_PREFIX + song.imagePath,
      albumTitle: song.albumTitle,
    };

    loadQueue([track], {
      source: { kind: "discover" },
      startIndex: 0,
      autoplay: true,
    });
  };

  return { playSong };
};

export default useSearchSongPlayback;
