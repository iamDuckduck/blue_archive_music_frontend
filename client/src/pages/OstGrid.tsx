import {
  DataGrid,
  type GridFilterItem,
  type GridFilterModel,
  type GridPaginationModel,
  type GridSortModel,
} from "@mui/x-data-grid";
import { ostColumns } from "../data_grid/columns";
import { Box } from "@mui/material";
import usePageOST from "../hooks/usePageOST";
import NavBar from "../Component/NavBar";
import { useMemo, useRef, useState } from "react";

export interface GridSortItem {
  field: string;
  sort: "asc" | "desc" | null | undefined;
}

const OstGrid = () => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  } as GridPaginationModel);

  const [sortModel, setSortModel] = useState({
    field: "ostNumber",
    sort: "asc",
  } as GridSortItem);

  const [filterModel, setfilterModel] = useState({} as GridFilterItem);

  const { data } = usePageOST(paginationModel, sortModel, filterModel);

  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = useRef(data?.totalElements || 0);

  const rowCount = useMemo(() => {
    if (data?.totalElements !== undefined) {
      rowCountRef.current = data.totalElements;
    }
    return rowCountRef.current;
  }, [data?.totalElements]);

  const handleSortrChange = (newSortModel: GridSortModel) => {
    console.log(newSortModel);
    // reminder it can be undefined
    setSortModel(newSortModel[0]);
  };

  const handleFilterChange = (newfilterModel: GridFilterModel) => {
    console.log(newfilterModel);
    if (newfilterModel.items[0].value) setfilterModel(newfilterModel.items[0]);
    else setfilterModel({} as GridFilterItem);
  };

  return (
    <Box display="flex" flexDirection="column" width="100%" alignItems="center">
      <NavBar></NavBar>
      <DataGrid
        sx={{ minWidth: 1000, minHeight: 500, mt: 10 }}
        rows={data?.content}
        columns={ostColumns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 20]}
        sortingMode="server"
        onSortModelChange={handleSortrChange}
        filterMode="server"
        onFilterModelChange={handleFilterChange}
      />
    </Box>
  );
};

export default OstGrid;
