import axios from "axios";
import { API_BASE_URL, MUSIC_SEARCH_ENDPOINT } from "../constants/api";
import type MusicSearchResponse from "../entities/MusicSearchResponse";

export const searchMusic = (query: string, signal: AbortSignal) =>
  axios
    .get<MusicSearchResponse>(`${API_BASE_URL}${MUSIC_SEARCH_ENDPOINT}`, {
      params: { query },
      signal,
    })
    .then((response) => response.data);
