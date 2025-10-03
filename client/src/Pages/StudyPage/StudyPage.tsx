import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import PageActions from "../../Contexts/Actions/PageActions";
import StudyActions from "../../Contexts/Actions/StudyActions";
import { RootStore } from "../../Contexts/Store";
import { PagingDto } from "../../Interfaces/PagingDtos";
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
  // {
  //   field: "mobileno",
  //   headerName: "Contact No.",
  //   editable: false,
  //   flex: 1,
  // },
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
   {
    field: "readerdoc",
    headerName: "Assigned Doctor",
    editable: false,
    flex: 2,
  },
];

const initial_filter: StudyFilterDto = {
  days_ago: 1,
  patient_no: ``,
  patient_name: ``,
  hospital_no: ``,
  referring_physician: ``,
  study_date_from: ``,
  study_date_to: ``,
  accession_no: ``,
  study_description: ``,
  urgency: [],
  modality: [],
  status: [],
  patient_type: [],
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

//modality

const urgencies = ["PICK-UP", "ROUTINE", "STAT", "SURCHARGE"];
const modalities = ["ASD", "BD", "CR", "CT", "DASD", "MG", "MI", "MR", "MS"];
const statuses = ["CHARGE", "DRAFT", "FINAL", "PERFORMED"];
const patient_types = ["Admitted OP", "Cash Current", "OP Current"];

const StudyPage: FC<StudyPageProps> = memo(() => {
  const dispatch = useDispatch();
  const divRef = useRef<HTMLDivElement>(null); // Ref to access the div element
  const [position, set_position] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const [is_loading_table, set_is_loading_table] = useState(false);
  const [filter, set_filter] = useState<StudyFilterDto>(initial_filter);

  const { studys } = useSelector((store: RootStore) => store.StudyReducer);

  const setIsLoadingTable = useCallback((is_loading: boolean) => {
    set_is_loading_table(is_loading);
  }, []);

  const [study_paging, set_study_paging] = useState<PagingDto>({
    page: initial_filter.days_ago,
    size: 100,
    total: studys?.length ?? 0,
    sort: {
      field: ``,
      sort: `asc`,
    },
    filter: {
      columnField: ``,
      operatorValue: ``,
      value: ``,
      type: `text`,
    },
    is_loading: false,
  });

  useEffect(() => {
    if (Array.isArray(study_paging?.filter?.value)) {
      study_paging.filter.value = study_paging?.filter?.value.join(",");
    }

    study_paging.other_filters = JSON.stringify(filter);

    dispatch(StudyActions.SetStudys(study_paging, setIsLoadingTable));
  }, [dispatch, setIsLoadingTable, study_paging]);

  useEffect(() => {
    if (divRef?.current) {
      const rect = divRef.current?.getBoundingClientRect();
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
          component={"form"}
          onSubmit={(e) => {
            e.preventDefault();
            const payload: PagingDto = {
              ...study_paging,
              other_filters: JSON.stringify(filter),
            };
            dispatch(StudyActions.SetStudys(payload, setIsLoadingTable));
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component={"div"} className="form-separator">
                Filter Options
              </Typography>
            </Grid>
            <Grid item xs={4} md={3} lg={2}>
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
                <MenuItem value={-1}>
                  <span>All</span>
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={4} md={3} lg={2}>
              <TextField
                label="Hospital No."
                size="small"
                fullWidth
                variant="standard"
                value={filter.hospital_no}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  set_filter({
                    ...filter,
                    hospital_no: e.target.value,
                  });
                }}
              ></TextField>
            </Grid>

            <Grid item xs={4} md={3} lg={2}>
              <TextField
                label="Patient Name"
                size="small"
                fullWidth
                variant="standard"
                value={filter.patient_name}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  set_filter({
                    ...filter,
                    patient_name: e.target.value,
                  });
                }}
              ></TextField>
            </Grid>

            <Grid item xs={4} md={3} lg={2}>
              <TextField
                label="Patient No."
                size="small"
                fullWidth
                variant="standard"
                value={filter.patient_no}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  set_filter({
                    ...filter,
                    patient_no: e.target.value,
                  });
                }}
              ></TextField>
            </Grid>

            <Grid item xs={4} md={3} lg={2}>
              <TextField
                label="Referring Physician"
                size="small"
                fullWidth
                variant="standard"
                value={filter.referring_physician}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  set_filter({
                    ...filter,
                    referring_physician: e.target.value,
                  });
                }}
              ></TextField>
            </Grid>

            <Grid item xs={4} md={3} lg={2}>
              <TextField
                label="Study Date (From)"
                size="small"
                fullWidth
                variant="standard"
                value={filter.study_date_from}
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                onChange={(e) => {
                  set_filter({
                    ...filter,
                    study_date_from: e.target.value,
                  });
                }}
              ></TextField>
            </Grid>

            <Grid item xs={4} md={3} lg={2}>
              <TextField
                label="Study Date (To)"
                size="small"
                fullWidth
                variant="standard"
                value={filter.study_date_to}
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                onChange={(e) => {
                  set_filter({
                    ...filter,
                    study_date_to: e.target.value,
                  });
                }}
              ></TextField>
            </Grid>

            <Grid item xs={4} md={3} lg={2}>
              <TextField
                label="Accession No"
                size="small"
                fullWidth
                variant="standard"
                value={filter.accession_no}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  set_filter({
                    ...filter,
                    accession_no: e.target.value,
                  });
                }}
              ></TextField>
            </Grid>

            <Grid item xs={4} md={3} lg={2}>
              <TextField
                label="Study Description"
                size="small"
                fullWidth
                variant="standard"
                value={filter.study_description}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  set_filter({
                    ...filter,
                    study_description: e.target.value,
                  });
                }}
              ></TextField>
            </Grid>

            <Grid item xs={8} md={6} lg={4}>
              <FormControl sx={{ width: `100%` }}>
                <InputLabel id="demo-multiple-checkbox-label" shrink variant="standard">
                  Urgency
                </InputLabel>
                <Select
                  multiple
                  size="small"
                  value={filter.urgency}
                  onChange={(event: SelectChangeEvent<typeof filter.urgency>) => {
                    const {
                      target: { value },
                    } = event;
                    set_filter({
                      ...filter,
                      urgency: typeof value === "string" ? value.split(",") : value,
                    });
                  }}
                  variant="standard"
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {urgencies.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={filter.urgency.includes(name)} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={8} md={6} lg={4}>
              <FormControl sx={{ width: `100%` }}>
                <InputLabel id="demo-multiple-checkbox-label" shrink variant="standard">
                  Modality
                </InputLabel>
                <Select
                  multiple
                  size="small"
                  value={filter.modality}
                  onChange={(event: SelectChangeEvent<typeof filter.modality>) => {
                    const {
                      target: { value },
                    } = event;
                    set_filter({
                      ...filter,
                      modality: typeof value === "string" ? value.split(",") : value,
                    });
                  }}
                  variant="standard"
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {modalities.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={filter.modality.includes(name)} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={8} md={6} lg={4}>
              <FormControl sx={{ width: `100%` }}>
                <InputLabel id="demo-multiple-checkbox-label" shrink variant="standard">
                  Status
                </InputLabel>
                <Select
                  multiple
                  size="small"
                  value={filter.status}
                  onChange={(event: SelectChangeEvent<typeof filter.status>) => {
                    const {
                      target: { value },
                    } = event;
                    set_filter({
                      ...filter,
                      status: typeof value === "string" ? value.split(",") : value,
                    });
                  }}
                  variant="standard"
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {statuses.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={filter.status.includes(name)} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={8} md={6} lg={4}>
              <FormControl sx={{ width: `100%` }}>
                <InputLabel id="demo-multiple-checkbox-label" shrink variant="standard">
                  Patient Type
                </InputLabel>
                <Select
                  multiple
                  size="small"
                  value={filter.patient_type}
                  onChange={(event: SelectChangeEvent<typeof filter.patient_type>) => {
                    const {
                      target: { value },
                    } = event;
                    set_filter({
                      ...filter,
                      patient_type: typeof value === "string" ? value.split(",") : value,
                    });
                  }}
                  variant="standard"
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {patient_types.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={filter.patient_type.includes(name)} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/*  */}
            <Grid item xs={12}>
              <Box
                display={`grid`}
                gridAutoFlow={`column`}
                gap={`1em`}
                justifyContent={`end`}
                justifyItems={`end`}
                alignItems={`center`}
                alignContent={`center`}
              >
                <Button
                  variant="contained"
                  color="warning"
                  // startIcon={is_show_study ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  onClick={() => {
                    set_filter(initial_filter);
                    const payload: PagingDto = {
                      ...study_paging,
                      other_filters: JSON.stringify(initial_filter),
                    };

                    dispatch(StudyActions.SetStudys(payload, setIsLoadingTable));
                  }}
                >
                  Clear
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  // onClick={() => {
                  //   const payload: PagingDto = {
                  //     ...study_paging,
                  //     other_filters: JSON.stringify(filter),
                  //   };

                  //   dispatch(StudyActions.SetStudys(payload, setIsLoadingTable));
                  // }}
                >
                  Search
                </Button>
              </Box>
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
                  pageSize={study_paging?.size ?? 0}
                  rowCount={!studys || !study_paging?.page ? 0 : studys?.length ?? 0 * (study_paging?.page + 1) + 1}
                  paginationMode="server"
                  onPageChange={(page) => {
                    set_study_paging({
                      ...study_paging,
                      page: page,
                    });
                  }}
                  onPageSizeChange={(size) => {
                    set_study_paging({
                      ...study_paging,
                      size: size,
                    });
                  }}
                  onSortModelChange={(sort) => {
                    if (sort.length > 0) {
                      set_study_paging({
                        ...study_paging,
                        sort: {
                          field: sort[0].field,
                          sort: sort[0].sort,
                        },
                      });
                    }
                  }}
                  onFilterModelChange={(filter) => {
                    const operator: any = filter.items[0].operatorValue;
                    set_study_paging({
                      ...study_paging,
                      filter: {
                        columnField: filter.items[0].columnField,
                        operatorValue: operator,
                        value: filter.items[0].value,
                        type: columns?.find((p) => p.headerName === filter.items[0].columnField)?.type ?? "string",
                      },
                    });
                  }}
                  page={Math.min(study_paging.page, Math.max(0, Math.ceil((studys?.length ?? 0) / study_paging.size) - 1))}
                  pagination
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
