import { Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import PageActions from "../../Contexts/Actions/PageActions";
import StudyActions from "../../Contexts/Actions/StudyActions";
import { RootStore } from "../../Contexts/Store";
import { StudyDto } from "../../Interfaces/StudyInterfaces";
import DateUtils from "../../Utils/DateUtils";
interface StudyPageProps {}

const columns: GridColDef<StudyDto>[] = [
  {
    field: "radresultno",
    headerName: "Result #",
    editable: false,
    width: 110,
    renderCell: ({ row }) => {
      return (
        <div>
          <Typography
            style={{
              textTransform: `capitalize`,
            }}
            className="link"
            variant="subtitle2"
          >
            <NavLink to={`/study/${row.radresultno}`}>{row?.radresultno} </NavLink>
          </Typography>
        </div>
      );
    },
  },
  {
    field: "resulttag",
    headerName: "Result Tag",
    editable: false,
    width: 110,
  },
  {
    field: "patientname",
    headerName: "Patient Name",
    editable: false,
    flex: 2,
  },
  {
    field: "urgency",
    headerName: "Urgency",
    editable: false,
    flex: 1,
  },
  {
    field: "modality",
    headerName: "Modality",
    editable: false,
    flex: 1,
  },
  {
    field: "referringdoc",
    headerName: "Doctor",
    editable: false,
    flex: 2,
  },
  {
    field: "studydate",
    headerName: "Study Date",
    editable: false,
    minWidth: 190,
    maxWidth: 190,
    type: `dateTime`,
    renderCell: ({ row }) => {
      return DateUtils.ReplaceDateTimeUtil(row.studydate, "-");
    },
  },
];

const StudyPage: FC<StudyPageProps> = memo(() => {
  const dispatch = useDispatch();

  const [is_loading_table, set_is_loading_table] = useState(false);

  const { studys } = useSelector((store: RootStore) => store.StudyReducer);

  const setIsLoadingTable = useCallback((is_loading: boolean) => {
    set_is_loading_table(is_loading);
  }, []);

  useEffect(() => {
    dispatch(StudyActions.SetStudys(setIsLoadingTable));
  }, [dispatch, setIsLoadingTable]);

  useEffect(() => {
    dispatch(
      PageActions.SetPageLinks([
        {
          label: "Studies",
          to: "/study",
        },
      ])
    );
  }, [dispatch]);
  return (
    <>
      <Paper
        style={{
          padding: `1em`,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div style={{ height: `calc(100vh - 230px)`, width: "100%" }}>
              <DataGrid
                getRowId={(p) => p.radresultno}
                density="compact"
                rows={studys ?? []}
                columns={columns}
                loading={is_loading_table}
                disableSelectionOnClick
              />
            </div>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
});

export default StudyPage;