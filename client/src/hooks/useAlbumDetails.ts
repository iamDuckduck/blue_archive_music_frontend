import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ms from "ms";
import type AlbumDetails from "../entities/AlbumDetails";
import { API_BASE_URL } from "../constants/api";

const useAlbumDetails = (albumId: number | undefined) => {
  return useQuery({
    queryKey: ["album-details", albumId],
    queryFn: () =>
      axios
        .get<AlbumDetails>(`${API_BASE_URL}/user/albums/${albumId}/songs`)
        .then((res) => res.data),
    enabled: albumId !== undefined && !Number.isNaN(albumId),
    staleTime: ms("10m"),
  });
};

export default useAlbumDetails;
