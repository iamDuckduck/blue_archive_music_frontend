import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../service/api-client";
import type Song from "../entities/Song";
import type OstType from "../entities/OstType";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { PUBLIC_URL_PREFIX } from "../constants/api";

const SONG_RANDOM_ENDPOINT = "/user/song/random";
const apiClient = new APIClient<Song>(SONG_RANDOM_ENDPOINT);

const useRandomSong = () => {
  const setCurrentTrack = useAudioPlayerStore((s) => s.setCurrentTrack);
  const setCurrentType = useAudioPlayerStore((s) => s.setCurrentType);
  const setTrackList = useAudioPlayerStore((s) => s.setTrackList);
  const setTrackIndex = useAudioPlayerStore((s) => s.setTrackIndex);
  const setIsPlaying = useAudioPlayerStore((s) => s.setIsPlaying);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["random-song"],
    queryFn: () => apiClient.getRandomSong(),
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (!data) return;

    setCurrentTrack({
      id: 0,
      name: data.title ?? "",
      src: data.audioPath ? PUBLIC_URL_PREFIX + data.audioPath : "",
      author: (data.artists ?? []).join(", "),
      thumbnail: data.imagePath ? PUBLIC_URL_PREFIX + data.imagePath : "",
    });
    setCurrentType({ name: data.albumTitle ?? "" } as OstType);
    setTrackList([]);
    setTrackIndex(0);
    setIsPlaying(true);
  }, [
    data,
    setCurrentTrack,
    setCurrentType,
    setTrackList,
    setTrackIndex,
    setIsPlaying,
  ]);

  return { refetch, isFetching };
};

export default useRandomSong;

