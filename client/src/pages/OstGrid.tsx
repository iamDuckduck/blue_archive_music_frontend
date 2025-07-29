import {
  DataGrid,
  type GridPaginationModel,
  type GridSortModel,
} from "@mui/x-data-grid";
import { ostColumns } from "../data_grid/columns";
import { Box } from "@mui/material";
import usePageOST from "../hooks/usePageOST";
import type OstPage from "../entities/OstPage";
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

  const [sortModel, setSortModel] = useState({} as GridSortItem);

  const { data } = usePageOST(paginationModel, sortModel);

  // Function to flatten and rename
  const flattenAndRename = (osts: OstPage[]) => {
    return osts.map((ost) => ({
      ...ost,
      volumn_name: ost.ostType.name,
      volume: ost.ostType.volume,
      ostType: undefined,
    }));
  };

  const flattern_data = data?.content
    ? flattenAndRename(data?.content)
    : undefined;

  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = useRef(data?.totalElements || 0);

  const rowCount = useMemo(() => {
    if (data?.totalElements !== undefined) {
      rowCountRef.current = data.totalElements;
    }
    return rowCountRef.current;
  }, [data?.totalElements]);

  const handleSortrChange = (newSortModel: GridSortModel) => {
    // reminder it can be undefined
    setSortModel(newSortModel[0]);
  };

  return (
    <Box display="flex" flexDirection="column" width="100%" alignItems="center">
      <NavBar></NavBar>
      <DataGrid
        sx={{ minWidth: 1000, minHeight: 500, mt: 10 }}
        rows={flattern_data}
        columns={ostColumns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 20]}
        sortingMode="server"
        onSortModelChange={handleSortrChange}
      />
    </Box>
  );
};

export default OstGrid;
