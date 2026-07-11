import { PUBLIC_URL_PREFIX } from "../constants/api";
import type { SongSearchResult } from "../entities/MusicSearchResponse";
import { useAudioPlayerStore, type Track } from "../store/audioPlayerStore";
import { getRandomSongList } from "../service/randomSongService";
import { songToTrack } from "../utils/songToTrack";

const useSearchSongPlayback = () => {
  const loadQueue = useAudioPlayerStore((state) => state.loadQueue);
  const appendDiscoverTracks = useAudioPlayerStore(
    (state) => state.appendDiscoverTracks,
  );

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

    getRandomSongList()
      .then((songs) => {
        const { queue } = useAudioPlayerStore.getState();

        // A newer queue or automatic refill won the race.
        if (queue.length !== 1 || queue[0] !== track) return;

        const discoverTracks = songs
          .filter((randomSong) => randomSong.id !== song.id)
          .map((randomSong, index) =>
            songToTrack(randomSong, index + 1, randomSong.albumTitle),
          );

        if (discoverTracks.length > 0) {
          appendDiscoverTracks(discoverTracks);
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to load search discover queue", error);
      });
  };

  return { playSong };
};

export default useSearchSongPlayback;
