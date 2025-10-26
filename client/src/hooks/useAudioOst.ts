import { useQuery } from "@tanstack/react-query";
import APIClient from "../service/api-client";
import type OstPage from "../entities/OstPage";

const apiClient = new APIClient<OstPage>("/user/ost");

const useAudioOst = (id: number | null) => {
  return useQuery({
    queryKey: ["audioOst", id],
    queryFn: () => apiClient.getAudioOst(id!),
    enabled: id !== null, // Only fetch when id is not null
  });
};

export default useAudioOst;
