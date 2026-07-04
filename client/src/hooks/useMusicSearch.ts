import { useQuery } from "@tanstack/react-query";
import { searchMusic } from "../service/musicSearch";
import useDebouncedValue from "./useDebouncedValue";

const SEARCH_DEBOUNCE_MS = 300;

const useMusicSearch = (query: string) => {
  const normalizedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(
    normalizedQuery,
    SEARCH_DEBOUNCE_MS,
  );

  return useQuery({
    queryKey: ["music-search", debouncedQuery],
    queryFn: ({ signal }) => searchMusic(debouncedQuery, signal),
    enabled: normalizedQuery.length > 0 && debouncedQuery.length > 0,
  });
};

export default useMusicSearch;
