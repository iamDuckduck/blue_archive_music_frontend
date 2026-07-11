import type Song from "../entities/Song";
import APIClient from "./api-client";

const apiClient = new APIClient<Song[]>("/user/song/random/list");

export const getRandomSongList = () => apiClient.getRandomSongList();
