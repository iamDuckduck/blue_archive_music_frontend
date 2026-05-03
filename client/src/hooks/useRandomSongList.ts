import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../service/api-client";
import type Song from "../entities/Song";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { songToTrack } from "../utils/songToTrack";

const SONG_RANDOM_ENDPOINT = "/user/song/random/list";
const apiClient = new APIClient<Song[]>(SONG_RANDOM_ENDPOINT);

/**
 * Fetches the first random queue once Home claims the random source.
 * Mounted in RootLayout so the query lifecycle survives route changes,
 * but fetching is gated on source.kind === "random" and no current track.
 */
const useRandomSongList = () => {
  const setRandomLoading = useAudioPlayerStore((s) => s.setRandomLoading);
  const loadQueue = useAudioPlayerStore((s) => s.loadQueue);
  const source = useAudioPlayerStore((s) => s.source);
  const hasTrack = useAudioPlayerStore((s) => !!s.currentTrack.src);

  const shouldAutoFetch = source?.kind === "random" && !hasTrack;

  const { data: songs, isFetching } = useQuery({
    queryKey: ["random-song-list"],
    queryFn: () => apiClient.getRandomSongList(),
    enabled: shouldAutoFetch,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  useEffect(() => {
    setRandomLoading(isFetching);
  }, [isFetching, setRandomLoading]);

  useEffect(() => {
    if (!songs) return;
    if (useAudioPlayerStore.getState().source?.kind !== "random") return;

    const tracks = songs.map((song, i) => songToTrack(song, i, song.albumTitle));
    loadQueue(tracks, {
      source: { kind: "random" },
      startIndex: 0,
      autoplay: true,
    });
  }, [songs, loadQueue]);
};

export default useRandomSongList;
