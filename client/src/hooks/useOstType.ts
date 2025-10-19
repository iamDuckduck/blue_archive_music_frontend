import { useQuery } from "@tanstack/react-query";
import { OST_TYPE_BASE_ENDPOINT } from "../constants/api";
import APIClient from "../service/api-client";
import ms from "ms";
import type OstType from "../entities/OstType";

const apiClient = new APIClient<OstType>(OST_TYPE_BASE_ENDPOINT);

const useOstType = () => {
  return useQuery({
    queryKey: ["ostType"],
    queryFn: () => apiClient.getAllOstType(),
    staleTime: ms("24h"),
  });
};

export default useOstType;
