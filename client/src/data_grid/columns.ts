import type { GridColDef } from "@mui/x-data-grid";

export const ostColumns: GridColDef[] = [
  { field: "ostNumber", headerName: "No.", flex: 0.3 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "author", headerName: "Author", flex: 1 },
  { field: "volumn", headerName: "Volumn", flex: 0.3 },
  { field: "volumn_name", headerName: "Volumn_name", flex: 1 },
];
