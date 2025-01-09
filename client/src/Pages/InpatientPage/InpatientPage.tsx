import { Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import PageActions from "../../Contexts/Actions/PageActions";
import { RootStore } from "../../Contexts/Store";
import { InpatientDto } from "../../Interfaces/InpatientInterfaces";
import DateUtils from "../../Utils/DateUtils";
import StringUtil from "../../Utils/StringUtil";
import InpatientNurseStations from "./InpatientNurseStations";
interface InpatientPageProps {}

const columns: GridColDef<InpatientDto>[] = [
  {
    field: "patno",
    headerName: "Patient #",
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
            <NavLink to={`/inpatients/${row.patno}/summary`}>
              {/* {`${row?.admlastname}, ${row.admfirstname}`.toLowerCase()} */}
              {row?.patno}
            </NavLink>
          </Typography>
        </div>
      );
    },
  },
  {
    field: "patientname",
    headerName: "Patient Name",
    editable: false,
    flex: 2,
  },

  {
    field: "patno",
    headerName: "Patient Number",
    editable: false,
    flex: 1,
  },
  {
    field: "hospitalno",
    headerName: "Hospital Number",
    editable: false,
    flex: 1,
  },
  {
    field: "admdiagnosis",
    headerName: "Diagnosis",
    editable: false,
    flex: 4,
    renderCell: ({ row }) => {
      return row.admdiagnosis;
    },
  },
  {
    field: "admissiondate",
    headerName: "Admission Date",
    editable: false,
    minWidth: 190,
    maxWidth: 190,
    type: `dateTime`,
    renderCell: ({ row }) => {
      return DateUtils.ReplaceDateTimeUtil(row.admissiondate, "-");
    },
  },
  {
    field: "confinement",
    headerName: "Confinement",
    editable: false,

    renderCell: ({ row }) => {
      return StringUtil.Ellipses(row.confinement, 90, "Not specified");
    },
  },
  {
    field: "nsunit",
    headerName: "NS",
    editable: false,
    flex: 1,
    minWidth: 100,
    maxWidth: 100,
  },
  {
    field: "roomcode",
    headerName: "Room",
    editable: false,
    flex: 1,
    minWidth: 100,
    maxWidth: 100,
  },
  {
    field: "bedno",
    headerName: "Bed",
    editable: false,
    flex: 1,
    minWidth: 100,
    maxWidth: 100,
  },
];

const InpatientPage: FC<InpatientPageProps> = memo(() => {
  const dispatch = useDispatch();

  const [is_loading_table, set_is_loading_table] = useState(false);

  const { inpatients } = useSelector((store: RootStore) => store.InpatientReducer);

  const setIsLoadingTable = useCallback((is_loading: boolean) => {
    set_is_loading_table(is_loading);
  }, []);

  useEffect(() => {
    dispatch(InpatientActions.SetInpatients({}, setIsLoadingTable));
  }, [dispatch, setIsLoadingTable]);

  useEffect(() => {
    dispatch(
      PageActions.SetPageLinks([
        {
          label: "Inpatients",
          to: "/inpatients",
        },
      ])
    );
  }, [dispatch]);
  return (
    <>
      {/* <Container disableGutters> */}
      <Paper
        style={{
          padding: `1em`,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <InpatientNurseStations setIsLoadingTable={setIsLoadingTable} />
          </Grid>

          <Grid item xs={12}>
            <div style={{ height: `calc(100vh - 230px)`, width: "100%" }}>
              <DataGrid
                getRowId={(e) => e.patno ?? -1}
                density="compact"
                rows={inpatients ?? []}
                columns={columns}
                loading={is_loading_table}
                disableSelectionOnClick
                // onFilterModelChange={(e) => {
                //   console.log(`onFilterModelChange`, e);
                // }}
                // onSortModelChange={(e) => {
                //   console.log(`onSortModelChange`, e);
                // }}
                // onPageChange={(e) => {
                //   console.log(`onPageChange`, e);
                // }}
              />
            </div>
          </Grid>
        </Grid>
      </Paper>
      {/* </Container> */}
    </>
  );
});

export default InpatientPage;
