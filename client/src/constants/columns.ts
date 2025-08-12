import {
  getGridNumericOperators,
  getGridStringOperators,
  type GridColDef,
} from "@mui/x-data-grid";

const getContainsOperator = () =>
  getGridStringOperators().filter((operator) => operator.value === "contains");

const getEqualOperator = () =>
  getGridNumericOperators().filter((operator) => operator.value === "=");

export const ostColumns: GridColDef[] = [
  {
    field: "ostNumber",
    headerName: "No.",
    flex: 0.3,
    filterOperators: getEqualOperator(),
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    filterOperators: getContainsOperator(),
  },
  {
    field: "author",
    headerName: "Author",
    flex: 1,
    filterOperators: getContainsOperator(),
  },
  {
    field: "volume",
    headerName: "Volume",
    flex: 0.3,
    filterOperators: getEqualOperator(),
  },
  {
    field: "volumeName",
    headerName: "Volume_name",
    flex: 1,
    filterOperators: getContainsOperator(),
  },
  {
    field: "play",
    headerName: "",
    filterable: false,
    sortable: false,
  },
];
