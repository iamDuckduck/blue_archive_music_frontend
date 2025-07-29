import { useQuery } from "@tanstack/react-query";
import APIClient from "../service/api-client";
import ms from "ms";
import type OstPage from "../entities/OstPage";
import type { GridSortItem } from "../pages/OstGrid";
import type { GridPaginationModel } from "@mui/x-data-grid";

const apiClient = new APIClient<OstPage>("/user/ost");

const usePageOST = (
  paginationModel: GridPaginationModel,
  sortModel: GridSortItem | undefined
) => {
  return useQuery({
    queryKey: ["pageOST", paginationModel, sortModel],
    queryFn: () =>
      apiClient.getPageOST({
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          field: sortModel?.field,
          sort: sortModel?.sort,
        },
      }),
    staleTime: ms("24h"),
  });
};

export default usePageOST;
