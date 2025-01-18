import { Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import PageActions from "../../Contexts/Actions/PageActions";
import StudyActions from "../../Contexts/Actions/StudyActions";
import { RootStore } from "../../Contexts/Store";
import { StudyDto, StudyFilterDto } from "../../Interfaces/StudyInterfaces";
import DateUtils from "../../Utils/DateUtils";
interface StudyPageProps {}

const columns: GridColDef<StudyDto>[] = [
  {
    field: "resulttag",
    headerName: "Result Tag",
    editable: false,
    width: 110,
  },
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
            <NavLink to={`/study/${row.radresultno}`} target="'_blank'">
              {row?.radresultno}
            </NavLink>
          </Typography>
        </div>
      );
    },
  },
  {
    field: "hospitalno",
    headerName: "Hospital #",
    editable: false,
    flex: 1,
  },
  {
    field: "patrefno",
    headerName: "Patient #",
    editable: false,
    flex: 1,
  },
  {
    field: "patientname",
    headerName: "Patient Name",
    editable: false,
    flex: 2,
  },
  {
    field: "dob",
    headerName: "DOB",
    editable: false,
    minWidth: 150,
    maxWidth: 150,
    type: `date`,
    renderCell: ({ row }) => {
      return DateUtils.ReplaceDateUtil(row.dob, "-");
    },
  },
  {
    field: "sex",
    headerName: "Sex",
    editable: false,
    minWidth: 45,
    maxWidth: 45,
  },
  {
    field: "address",
    headerName: "Address",
    editable: false,
    flex: 1,
  },
  //address
  {
    field: "mobileno",
    headerName: "Contact No.",
    editable: false,
    flex: 1,
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
  {
    field: "procdesc",
    headerName: "Description",
    editable: false,
    flex: 2,
  },
  {
    field: "modality",
    headerName: "Modality",
    editable: false,
    flex: 1,
  },
  {
    field: "urgency",
    headerName: "Urgency",
    editable: false,
    flex: 1,
  },
  {
    field: "referringdoc",
    headerName: "Referring Physician",
    editable: false,
    flex: 2,
  },
];

const StudyPage: FC<StudyPageProps> = memo(() => {
  const dispatch = useDispatch();
  const divRef = useRef<HTMLDivElement>(null); // Ref to access the div element
  const [position, set_position] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const [is_loading_table, set_is_loading_table] = useState(false);
  const [filter, set_filter] = useState<StudyFilterDto>({ days_ago: 0 });

  const { studys } = useSelector((store: RootStore) => store.StudyReducer);

  const setIsLoadingTable = useCallback((is_loading: boolean) => {
    set_is_loading_table(is_loading);
  }, []);

  useEffect(() => {
    dispatch(StudyActions.SetStudys(filter, setIsLoadingTable));
  }, [dispatch, filter, setIsLoadingTable]);

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      set_position({ top: rect.top, left: rect.left });
    }
  }, []);

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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper
          style={{
            padding: `1em`,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component={"div"} className="form-separator">
                Filter Options
              </Typography>
            </Grid>
            <Grid item xs={4} md={3} lg={2} xl={1}>
              <TextField
                label="Show Results Since"
                select
                size="small"
                fullWidth
                variant="standard"
                value={filter.days_ago}
                SelectProps={{
                  MenuProps: {
                    disableScrollLock: true,
                  },
                }}
                onChange={(e) => {
                  set_filter({
                    ...filter,
                    days_ago: parseInt(e.target.value),
                  });
                }}
              >
                <MenuItem value={0}>
                  <span>Today</span>
                </MenuItem>
                <MenuItem value={1}>
                  <span>Yesterday</span>
                </MenuItem>
                <MenuItem value={2}>
                  <span>2 days ago</span>
                </MenuItem>
                <MenuItem value={7}>
                  <span>7 days ago</span>
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper
          ref={divRef}
          style={{
            padding: `1em`,
          }}
        >
          <Grid container spacing={2}>
            {/* <Grid container rowSpacing={2} columnSpacing={2}> */}

            <Grid item xs={12}></Grid>

            <Grid item xs={12}>
              <Typography component={"div"} className="form-separator">
                Results
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div style={{ height: `calc(100vh - ${position.top + 140}px)`, width: "100%" }}>
                <DataGrid
                  getRowId={(p) => p.radresultno}
                  density="compact"
                  rows={studys ?? []}
                  columns={columns}
                  loading={is_loading_table}
                  disableSelectionOnClick
                  initialState={{
                    sorting: {
                      sortModel: [{ field: `studydate`, sort: `desc` }],
                    },
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
});

export default StudyPage;
