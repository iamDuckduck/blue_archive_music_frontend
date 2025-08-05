import type { GridColDef } from "@mui/x-data-grid";

export const ostColumns: GridColDef[] = [
  { field: "ostNumber", headerName: "No.", flex: 0.3 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "author", headerName: "Author", flex: 1 },
  { field: "volume", headerName: "Volume", flex: 0.3 },
  { field: "volumeName", headerName: "Volume_name", flex: 1 },
];
