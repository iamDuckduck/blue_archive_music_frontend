import { PUBLIC_URL_PREFIX } from "../constants/api";
import type { Track } from "../store/audioPlayerStore";
import type Song from "../entities/Song";

export const songToTrack = (song: Song, id = 0, albumTitle?: string): Track => ({
  id,
  songId: song.id,
  name: song.title ?? "",
  src: song.audioPath ? PUBLIC_URL_PREFIX + song.audioPath : "",
  author: (song.artists ?? []).join(", "),
  thumbnail: song.imagePath ? PUBLIC_URL_PREFIX + song.imagePath : undefined,
  albumTitle,
});
