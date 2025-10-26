import { useQuery } from "@tanstack/react-query";
import { OST_LIST_URL } from "../constants/api";
import APIClient from "../service/api-client";
import ms from "ms";
import type OstList from "../entities/OstList";

const apiClient = new APIClient<OstList>(OST_LIST_URL);

const useOstVolume = (volume: number) => {
  return useQuery({
    queryKey: ["ost", volume],
    queryFn: () =>
      apiClient.getOstByVolume({
        params: {
          volume: volume,
        },
      }),
    staleTime: ms("24h"),
  });
};

export default useOstVolume;
