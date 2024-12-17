import { Box, Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollapseIconBotton from "../../Components/CollapseIconButton/CollapseIconButtonUi";
import PreviewPDF, { IPdf } from "../../Components/Skeletons/PreviewPdf";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import PageActions from "../../Contexts/Actions/PageActions";
import InpatientApi from "../../Contexts/Apis/InpatientApi";
import { RootStore } from "../../Contexts/Store";
import { InpatientDto } from "../../Interfaces/InpatientInterfaces";
import DateUtils from "../../Utils/DateUtils";

interface InpatientManageTabHistoryProps {
  patno: string;
}

const InpatientManageTabHistory: FC<InpatientManageTabHistoryProps> = memo(
  ({ patno }) => {
    const dispatch = useDispatch();
    const [pdf_files, set_pdf_files] = useState<IPdf[]>([]);

    const { inpatient_history, inpatient_chart } = useSelector(
      (store: RootStore) => store.InpatientReducer
    );

    const [is_loading_table, set_is_loading_table] = useState<boolean>(false);
    const columns: GridColDef<InpatientDto>[] = [
      {
        field: "",
        headerName: "Actions",
        editable: false,
        // flex: ,
        width: 120,
        align: `center`,
        headerAlign: `center`,
        sortable: false,
        filterable: false,
        hideSortIcons: true,
        disableColumnMenu: true,
        renderCell: (params) => {
          const row = params.row;

          return (
            <CollapseIconBotton
              iconColor="primary"
              buttonColor="primary"
              buttons={[
                {
                  text: "Preview Patient Chart",
                  color: "primary",
                  disabled: !row?.doc_desc,
                  handleClick: async () => {
                    handleSetPreviewPatientChart(row);
                  },
                },
              ]}
            />
          );
        },
      },
      {
        field: "patno",
        headerName: "Patient No",
        editable: false,
        minWidth: 105,
        maxWidth: 105,
      },
      {
        field: "admissiondate",
        headerName: "Admission Date",
        editable: false,
        type: `dateTime`,
        minWidth: 190,
        maxWidth: 190,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.admissiondate, "-");
        },
      },
      {
        field: "dischargedate",
        headerName: "Discharge Date",
        editable: false,
        type: `dateTime`,
        minWidth: 190,
        maxWidth: 190,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.dischargedate, "-");
        },
      },
      {
        field: "confinement",
        headerName: "Confinement",
        editable: false,
        flex: 1,
      },
      {
        field: "chiefcomplaint",
        headerName: "Chief Complaint",
        editable: false,
        flex: 1,
      },
      {
        field: "admdiagnosis",
        headerName: "Diagnosis",
        editable: false,
        flex: 1,
      },
      {
        field: "finaldx",
        headerName: "FinalDx",
        editable: false,
        flex: 1,
      },
    ];

    const handleSetPreviewPatientChart = useCallback(
      async (payload: InpatientDto) => {
        if (!!payload.patno) {
          dispatch(PageActions.SetLoading(true));
          try {
            const data = await InpatientApi.GetInpatientChart(payload.patno);
            console.log(`data`, data);

            dispatch(InpatientActions.SetInpatientChart(data));
          } catch (error) {
            dispatch(PageActions.SetHttpErrorPrompt(error));
          }

          dispatch(PageActions.SetLoading(false));
        }
      },
      [dispatch]
    );

    useEffect(() => {
      let mounted = true;
      const fetch = async () => {
        set_is_loading_table(true);

        const data: InpatientDto[] = await InpatientApi.GetInpatientHistory(
          patno
        );

        dispatch(InpatientActions.SetInpHistory(data));

        set_is_loading_table(false);
      };

      mounted && fetch();

      return () => {
        mounted = false;
      };
    }, [dispatch, patno]);

    useEffect(() => {
      if (!!inpatient_chart) {
        const files: IPdf[] = [];
        files.push({
          doc_title: `${
            !!inpatient_chart?.doc_remarks
              ? `${inpatient_chart?.doc_remarks} | `
              : ``
          }  ${inpatient_chart?.doc_filename}`,
          file: inpatient_chart?.blob_file,
        });

        set_pdf_files(files);
      } else {
        set_pdf_files([]);
      }
    }, [inpatient_chart]);

    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box style={{ height: 500, width: "100%" }}>
              <DataGrid
                getRowId={(e) => e.patno ?? ``}
                density="compact"
                rows={inpatient_history ?? []}
                columns={columns}
                loading={is_loading_table}
                disableSelectionOnClick
              />
            </Box>
          </Grid>

          {!!inpatient_chart && (
            <PreviewPDF
              handleClose={() => {
                dispatch(InpatientActions.SetInpatientChart());
              }}
              files={pdf_files}
              actions={<></>}
            />
          )}
        </Grid>
      </>
    );
  }
);

export default InpatientManageTabHistory;
