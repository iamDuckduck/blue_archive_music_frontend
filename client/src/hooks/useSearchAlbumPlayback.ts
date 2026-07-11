import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ms from "ms";
import { getAlbumDetails } from "../service/albumDetails";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import { songToTrack } from "../utils/songToTrack";

const useSearchAlbumPlayback = () => {
  const [loadingAlbumId, setLoadingAlbumId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const loadQueue = useAudioPlayerStore((state) => state.loadQueue);

  const playAlbum = async (albumId: number) => {
    setLoadingAlbumId(albumId);

    try {
      const album = await queryClient.fetchQuery({
        queryKey: ["album-details", albumId],
        queryFn: ({ signal }) => getAlbumDetails(albumId, signal),
        staleTime: ms("10m"),
      });
      const tracks = album.songList.map((song, index) =>
        songToTrack(song, index, album.title),
      );

      if (tracks.length === 0) return false;

      loadQueue(tracks, {
        source: { kind: "album", albumId, title: album.title },
        startIndex: 0,
        autoplay: true,
      });
      return true;
    } catch (error: unknown) {
      console.error("Failed to play album from search", error);
      return false;
    } finally {
      setLoadingAlbumId(null);
    }
  };

  return { playAlbum, loadingAlbumId };
};

export default useSearchAlbumPlayback;
