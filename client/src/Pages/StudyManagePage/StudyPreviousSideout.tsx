import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Grid, IconButton, Paper, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RtfComponent from "../../Components/RtfComponent/RtfComponent";
import { RootStore } from "../../Contexts/Store";
import { StudyDto } from "../../Interfaces/StudyInterfaces";
import DateUtils from "../../Utils/DateUtils";

import Preview from "@mui/icons-material/Preview";

interface StudyPreviousSideoutProps {
  // set_font_size: Dispatch<SetStateAction<string>>;
  // set_rtf_impression: Dispatch<SetStateAction<string>>;
  // onSubmitTemplate: (form_type: FormType, payload: StudyTemplateDto) => Promise<void>;
}

const StudyPreviousSideout: FC<StudyPreviousSideoutProps> = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { study_prevs } = useSelector((store: RootStore) => store.StudyReducer);
  const [font_size, set_font_size] = useState(`11pt`);
  const [selected_prev_study, set_selected_prev_study] = useState<StudyDto>();

  const columns: GridColDef<StudyDto>[] = [
    {
      field: "",
      headerName: "Actions",
      editable: false,
      minWidth: 100,
      maxWidth: 100,
      align: `center`,
      pinnable: true,
      renderCell: ({ row }) => {
        return (
          <>
            <Box>
              <IconButton
                title={"Preview Study Impression"}
                onClick={() => {
                  set_selected_prev_study(row);
                }}
                size={"small"}
              >
                <Preview fontSize="small" color="primary" />
              </IconButton>
              <IconButton
                title={"Open In New Tab"}
                onClick={() => {
                  window.open(`/study/${row?.radresultno}`, "_blank");
                }}
                size={"small"}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        );
      },
    },
    {
      field: "radresultno",
      headerName: "Result #",
      editable: false,
      width: 110,
      // renderCell: ({ row }) => {
      //   return (
      //     <div>
      //       <Typography
      //         style={{
      //           textTransform: `capitalize`,
      //         }}
      //         className="link"
      //         variant="subtitle2"
      //       >
      //         <a href={`/study/${row?.radresultno}`} target="__blank">
      //           {row?.radresultno}{" "}
      //         </a>
      //       </Typography>
      //     </div>
      //   );
      // },
    },
    {
      field: "modality",
      headerName: "Modality",
      editable: false,
      width: 100,
    },
    {
      field: "procdesc",
      headerName: "Description",
      editable: false,
      width: 110,
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
      field: "age",
      headerName: "Age",
      editable: false,
      flex: 2,
    },
    {
      field: "birthdate",
      headerName: "Birth Date",
      editable: false,
      minWidth: 150,
      maxWidth: 150,
      type: `date`,
      renderCell: ({ row }) => {
        return DateUtils.ReplaceDateUtil(row.birthdate, "-");
      },
    },
    {
      field: "dateencoded",
      headerName: "Study Date",
      editable: false,
      minWidth: 190,
      maxWidth: 190,
      type: `dateTime`,
      renderCell: ({ row }) => {
        return DateUtils.ReplaceDateTimeUtil(row.dateencoded, "-");
      },
    },
  ];

  useEffect(() => {
    set_font_size(selected_prev_study?.font_size ?? `11px`);

    return () => {};
  }, [selected_prev_study?.font_size]);

  return (
    <Grid container spacing={3} height={`100%`}>
      <Grid item xs={4}>
        <Paper style={{ height: `100%` }}>
          <DataGrid
            getRowId={(p) => p.radresultno}
            density="compact"
            rows={study_prevs ?? []}
            columns={columns}
            loading={false}
            disableSelectionOnClick
          />
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <RtfComponent
          value={selected_prev_study?.radresulthtml ?? ""}
          read_only={true}
          // height={is_full_screen_study ? `82vh` : `700px`}
          font_size={font_size}
          set_font_size={set_font_size}
          actions={[]}
          height="calc(100vh - 145px)"
        />
      </Grid>
    </Grid>
    // </Box>
  );
});

export default StudyPreviousSideout;
