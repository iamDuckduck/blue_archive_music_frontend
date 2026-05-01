import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../service/api-client";
import type Song from "../entities/Song";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { PUBLIC_URL_PREFIX } from "../constants/api";

const SONG_RANDOM_ENDPOINT = "/user/song/random";
const apiClient = new APIClient<Song>(SONG_RANDOM_ENDPOINT);

const useRandomSong = () => {
  const source = useAudioPlayerStore((s) => s.source);
  const hasTrack = useAudioPlayerStore((s) => !!s.currentTrack.src);

  // Auto-fetch only on the very first entry where playback hasn't started
  // yet AND no album/playlist source has claimed the player. Subsequent
  // visits re-use the cached track; the only way to load another random
  // song is an explicit `refetch()` (registered with the store as
  // `randomFetcher` so playNext / onTrackEnded can call it).
  const isRandomScope = !source || source.kind === "random";
  const shouldAutoFetch = isRandomScope && !hasTrack;

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["random-song"],
    queryFn: () => apiClient.getRandomSong(),
    enabled: shouldAutoFetch,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (!data) return;
    const s = useAudioPlayerStore.getState();
    // Album/playlist source has taken over: don't clobber its currentTrack
    // with a stale random-song response that arrived after navigation.
    if (s.source && s.source.kind !== "random") return;

    s.setCurrentTrack({
      id: 0,
      name: data.title ?? "",
      src: data.audioPath ? PUBLIC_URL_PREFIX + data.audioPath : "",
      author: (data.artists ?? []).join(", "),
      thumbnail: data.imagePath ? PUBLIC_URL_PREFIX + data.imagePath : "",
      albumTitle: data.albumTitle ?? "",
    });
    s.setIsPlaying(true);
  }, [data]);

  return { refetch, isFetching };
};

export default useRandomSong;
