import axios from "axios";
import { API_BASE_URL } from "../constants/api";
import type AlbumDetails from "../entities/AlbumDetails";

export const getAlbumDetails = (albumId: number, signal?: AbortSignal) =>
  axios
    .get<AlbumDetails>(`${API_BASE_URL}/user/albums/${albumId}/songs`, {
      signal,
    })
    .then((response) => response.data);
