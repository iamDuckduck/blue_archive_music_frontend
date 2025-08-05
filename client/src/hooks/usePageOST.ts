import { useQuery } from "@tanstack/react-query";
import APIClient from "../service/api-client";
import ms from "ms";
import type OstPage from "../entities/OstPage";
import type { GridSortItem } from "../pages/OstGrid";
import type { GridFilterItem, GridPaginationModel } from "@mui/x-data-grid";

const apiClient = new APIClient<OstPage>("/user/ost");

const usePageOST = (
  paginationModel: GridPaginationModel,
  sortModel: GridSortItem | undefined,
  filterModel: GridFilterItem | undefined
) => {
  return useQuery({
    queryKey: ["pageOST", paginationModel, sortModel, filterModel],
    queryFn: () =>
      apiClient.getPageOST({
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          sortField: sortModel?.field,
          sortDirection: sortModel?.sort,
          filterField: filterModel?.field,
          filterValue: filterModel?.value,
        },
      }),
    staleTime: ms("24h"),
  });
};

export default usePageOST;
