import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { getAlbumDetails } from "../service/albumDetails";

const useAlbumDetails = (albumId: number | undefined) => {
  return useQuery({
    queryKey: ["album-details", albumId],
    queryFn: ({ signal }) => getAlbumDetails(albumId!, signal),
    enabled: albumId !== undefined && !Number.isNaN(albumId),
    staleTime: ms("10m"),
  });
};

export default useAlbumDetails;
