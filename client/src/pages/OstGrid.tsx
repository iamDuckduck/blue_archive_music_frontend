import {
  DataGrid,
  type GridColDef,
  type GridFilterModel,
  type GridRowId,
  type GridSortModel,
} from "@mui/x-data-grid";
import { ostColumns } from "../constants/columns";
import { Box, Fade } from "@mui/material";
import usePageOST from "../hooks/usePageOST";
import NavBar from "../Component/NavBar";
import { useEffect, useMemo, useRef, useState } from "react";
import { GRID_DEFAULTS } from "../constants/gridDefaults";
import { GridPlayButton } from "../Component/GridPlayButton";
import { AudioPlayer } from "../Component/AudioPlayer";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import type OstPage from "../entities/OstPage";

const OstGrid = () => {
  // pagination, sorting and filtering states
  const [paginationModel, setPaginationModel] = useState(
    GRID_DEFAULTS.INITIAL_PAGINATION
  );
  const [sortModel, setSortModel] = useState(GRID_DEFAULTS.INITIAL_SORT);
  const [filterModel, setFilterModel] = useState(GRID_DEFAULTS.INITIAL_FILTER);
  const trackList = useAudioPlayerStore((s) => s.trackList);
  const setTrackList = useAudioPlayerStore((s) => s.setTrackList);

  // data query for OST
  const { data } = usePageOST(paginationModel, sortModel, filterModel);

  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = useRef(data?.totalElements || 0);

  const rowCount = useMemo(() => {
    if (data?.totalElements !== undefined) {
      rowCountRef.current = data.totalElements;
    }
    return rowCountRef.current;
  }, [data?.totalElements]);

  // events
  const handleSortChange = (newSortModel: GridSortModel) => {
    // it can be undefined
    setSortModel(newSortModel[0] ?? GRID_DEFAULTS.INITIAL_SORT);
  };

  const handleFilterChange = (newFilterModel: GridFilterModel) => {
    setFilterModel(
      newFilterModel.items[0]?.value
        ? newFilterModel.items[0]
        : GRID_DEFAULTS.INITIAL_FILTER
    );
  };

  const renderPlayButton = (columns: GridColDef[]) =>
    columns.map((column) =>
      column.field === "play"
        ? {
            ...column,
            renderCell: (params: { id: GridRowId }) => (
              <GridPlayButton rowId={params.id}></GridPlayButton>
            ),
          }
        : column
    );

  useEffect(() => {
    setTrackList(data?.content || ({} as OstPage[]));
  }, [data?.content, trackList, setTrackList]);
  return (
    <>
      <Fade in={true} timeout={3000}>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="center"
        >
          <NavBar></NavBar>
          <DataGrid
            sx={{ minWidth: 1000, mt: 10 }}
            rows={data?.content}
            columns={renderPlayButton(ostColumns)}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationMode="server"
            rowCount={rowCount}
            pageSizeOptions={[5, 10, 20]}
            sortingMode="server"
            onSortModelChange={handleSortChange}
            filterMode="server"
            onFilterModelChange={handleFilterChange}
            disableRowSelectionOnClick
          />
        </Box>
      </Fade>
      <AudioPlayer></AudioPlayer>
    </>
  );
};

export default OstGrid;
