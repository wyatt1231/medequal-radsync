import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Chip, Grid, IconButton, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import PageActions from "../../Contexts/Actions/PageActions";
import { RootStore } from "../../Contexts/Store";
import { StudyDto } from "../../Interfaces/StudyInterfaces";
import DateUtils from "../../Utils/DateUtils";

interface StudyNextSideoutProps {
  currentRadresulthtml?: string;
  loadedRadresulthtml?: string;
}

const StudyNextSideout: FC<StudyNextSideoutProps> = memo(({ currentRadresulthtml, loadedRadresulthtml }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { study_nexts } = useSelector((store: RootStore) => store.StudyReducer);

  const navigateToProcedure = (radresultno: string): void => {
    dispatch(PageActions.PopPageSideout());
    history.push(`/study/${radresultno}`);
  };

  const onClickGo = (row: StudyDto): void => {
    const hasUnsavedChanges = (currentRadresulthtml ?? "") !== (loadedRadresulthtml ?? "");

    if (hasUnsavedChanges) {
      dispatch(
        PageActions.SetPageConfirmation({
          open: true,
          continueCallback: async () => {
            navigateToProcedure(row.radresultno);
          },
        })
      );
      return;
    }

    navigateToProcedure(row.radresultno);
  };

  const columns: GridColDef<StudyDto>[] = [
    {
      field: "actions",
      headerName: "Go",
      editable: false,
      minWidth: 90,
      maxWidth: 90,
      align: `center`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box>
          <IconButton title={"Go to this procedure"} onClick={() => onClickGo(row)} size={"small"} color="primary">
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
          <IconButton
            title={"Open in New Tab"}
            onClick={() => {
              window.open(`/study/${row?.radresultno}`, "_blank");
            }}
            size={"small"}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    {
      field: "radresultno",
      headerName: "Result #",
      editable: false,
      width: 110,
    },
    {
      field: "modality",
      headerName: "Modality",
      editable: false,
      width: 100,
    },
    {
      field: "procdesc",
      headerName: "Procedure",
      editable: false,
      flex: 1,
      minWidth: 220,
    },
    {
      field: "urgency",
      headerName: "Urgency",
      editable: false,
      width: 110,
      renderCell: ({ row }) => (row?.urgency ? <Chip label={row.urgency} size="small" color="warning" variant="outlined" /> : "-"),
    },
    {
      field: "resulttag",
      headerName: "Status",
      editable: false,
      width: 110,
      renderCell: ({ row }) => <Chip label={row?.resulttag ?? "PERFORMED"} size="small" color="info" />,
    },
    {
      field: "studydate",
      headerName: "Study Date",
      editable: false,
      minWidth: 160,
      maxWidth: 160,
      renderCell: ({ row }) => DateUtils.ReplaceDateTimeUtil(row.studydate, "-"),
    },
  ];

  return (
    <Box height={`100%`} padding={`1em`}>
      <Grid container spacing={2} height={`100%`}>
        <Grid item xs={12}>
          <Typography variant="body2" color="textSecondary">
            Pick another performed procedure for this patient to jump to it without going back to the studies list.
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ height: `calc(100% - 50px)` }}>
          <Paper style={{ height: `100%` }}>
            <DataGrid
              getRowId={(p) => p.radresultno}
              density="compact"
              rows={study_nexts ?? []}
              columns={columns}
              loading={false}
              disableSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default StudyNextSideout;
