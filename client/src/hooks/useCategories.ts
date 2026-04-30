import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ms from "ms";
import type Category from "../entities/Category";
import { API_BASE_URL } from "../constants/api";

const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      axios
        .get<Category[]>(`${API_BASE_URL}/user/categories/details`)
        .then((res) => res.data),
    staleTime: ms("24h"),
  });
};

export default useCategories;
