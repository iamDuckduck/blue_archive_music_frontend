import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../service/api-client";
import type Song from "../entities/Song";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { songToTrack } from "../utils/songToTrack";

const SONG_RANDOM_ENDPOINT = "/user/song/random/list";
const apiClient = new APIClient<Song[]>(SONG_RANDOM_ENDPOINT);

/**
 * Manages the discover/random queue. Mounted once in RootLayout.
 *
 * Fetches in two cases:
 * 1. Initial load — no active track yet (first visit, any route).
 * 2. Near-end refill — any source, repeat="off", ≤2 tracks remaining.
 *    After appending, the queue becomes discover-backed so subsequent
 *    near-end checks keep refilling instead of stopping.
 */
const useRandomSongList = () => {
  const setRandomLoading = useAudioPlayerStore((s) => s.setRandomLoading);
  const loadQueue = useAudioPlayerStore((s) => s.loadQueue);
  const appendDiscoverTracks = useAudioPlayerStore((s) => s.appendDiscoverTracks);

  const hasTrack = useAudioPlayerStore((s) => !!s.currentTrack.src);
  const queueIndex = useAudioPlayerStore((s) => s.queueIndex);
  const queueLength = useAudioPlayerStore((s) => s.queue.length);
  const repeat = useAudioPlayerStore((s) => s.repeat);

  // Fires for any source: album with repeat=off near its end also qualifies.
  const nearEnd =
    repeat === "off" &&
    hasTrack &&
    queueLength > 0 &&
    queueIndex >= queueLength - 2;

  const shouldFetch = !hasTrack || nearEnd;

  const { data: songs, isFetching } = useQuery({
    queryKey: ["random-song-list"],
    queryFn: () => apiClient.getRandomSongList(),
    enabled: shouldFetch,
    // staleTime: 0 ensures re-fetch every time enabled flips back to true
    // (near-end refill triggers). Without this, React Query returns the
    // cached list silently and appendDiscoverTracks would never run again.
    staleTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  useEffect(() => {
    setRandomLoading(isFetching);
  }, [isFetching, setRandomLoading]);

  // Runs only when a fresh API response arrives (songs reference changes).
  // Reads live store state via getState() to avoid stale-closure issues.
  useEffect(() => {
    if (!songs) return;

    const { currentTrack, queue, queueIndex: liveIndex, repeat: liveRepeat } =
      useAudioPlayerStore.getState();

    if (!currentTrack.src) {
      // Initial load — populate the discover queue, don't autoplay.
      const tracks = songs.map((song, i) => songToTrack(song, i, song.albumTitle));
      loadQueue(tracks, { source: { kind: "discover" }, startIndex: 0, autoplay: false });
      return;
    }

    // Refill guard: only append if still near-end (stale response protection).
    const liveNearEnd =
      liveRepeat === "off" &&
      queue.length > 0 &&
      liveIndex >= queue.length - 2;
    if (!liveNearEnd) return;

    const tracks = songs.map((song, i) =>
      songToTrack(song, queue.length + i, song.albumTitle),
    );
    appendDiscoverTracks(tracks);
  }, [songs, loadQueue, appendDiscoverTracks]);
};

export default useRandomSongList;
