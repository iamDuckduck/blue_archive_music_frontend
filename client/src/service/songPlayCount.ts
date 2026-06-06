import axios from "axios";
import { API_BASE_URL, SONG_PLAY_COUNT_ENDPOINT } from "../constants/api";

export const incrementSongPlayCount = (songId: number) =>
  axios.post<void>(`${API_BASE_URL}${SONG_PLAY_COUNT_ENDPOINT(songId)}`);
