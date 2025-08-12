import type { GridFilterItem, GridPaginationModel } from "@mui/x-data-grid";
import type { GridSortItem } from "../entities/GridsortItem";

export const GRID_DEFAULTS = {
  INITIAL_PAGINATION: { pageSize: 5, page: 0 } as GridPaginationModel,
  INITIAL_SORT: { field: "ostNumber", sort: "asc" } as GridSortItem,
  INITIAL_FILTER: {} as GridFilterItem,
};
