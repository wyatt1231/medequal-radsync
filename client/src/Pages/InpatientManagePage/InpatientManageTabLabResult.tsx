import { Box, Grid } from "@mui/material";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollapseIconBotton from "../../Components/CollapseIconButton/CollapseIconButtonUi";
import PreviewPDF, { IPdf } from "../../Components/Skeletons/PreviewPdf";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import { RootStore } from "../../Contexts/Store";
import { LabResultDto } from "../../Interfaces/PatientLabResultInterfaces";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PageActions from "../../Contexts/Actions/PageActions";
import InpatientApi from "../../Contexts/Apis/InpatientApi";
import DateUtils from "../../Utils/DateUtils";

interface InpatientManageTabLabResultProps {
  patno: string;
}

const InpatientManageTabLabResult: FC<InpatientManageTabLabResultProps> = memo(
  ({ patno }) => {
    const dispatch = useDispatch();
    const [pdf_files, set_pdf_files] = useState<IPdf[]>([]);

    const { inpatient_lab_results, inpatient_lab_result } = useSelector(
      (store: RootStore) => store.InpatientReducer
    );

    const [is_loading_table, set_is_loading_table] = useState<boolean>(false);
    const columns: GridColDef<LabResultDto>[] = [
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
                  text: "Preview Result File",
                  handleClick: async () => {
                    handleSetPreviewLabResult(row);
                    // dispatch(PageActions.SetLoading(true));
                    // try {
                    //   const link =
                    //     await InpatientApi.GetInpatientProcedureResultLink(
                    //       patno,
                    //       row.resultno
                    //     );
                    //   window.open(link, "_blank", "noopener,noreferrer");
                    // } catch (error) {
                    //   dispatch(PageActions.SetHttpErrorPrompt(error));
                    // }
                    // dispatch(PageActions.SetLoading(false));
                  },
                },
              ]}
            />
          );
        },
      },
      {
        field: "doc_desc",
        headerName: "Description",
        editable: false,
        flex: 1,
      },
      {
        field: "doc_remarks",
        headerName: "Remarks",
        editable: false,
        flex: 1,
      },
      {
        field: "dateuploaded",
        headerName: "Date Uploaded",
        editable: false,
        type: `dateTime`,
        flex: 1,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.dateuploaded, "-");
        },
      },
    ];

    const handleSetPreviewLabResult = useCallback(
      async (payload: LabResultDto) => {
        if (!!patno && !!payload?.ftpuploadkey) {
          dispatch(PageActions.SetLoading(true));
          try {
            const data = await InpatientApi.GetInpatientLabResultPdf(
              patno,
              payload.ftpuploadkey
            );

            console.log(`data`, data);

            dispatch(InpatientActions.SetLabResult(data));
          } catch (error) {
            dispatch(PageActions.SetHttpErrorPrompt(error));
          }

          dispatch(PageActions.SetLoading(false));

          // dispatch(InpatientActions.SetLabResult(patno, data.ftpuploadkey));
        }
      },
      [dispatch, patno]
    );

    useEffect(() => {
      let mounted = true;
      const fetch = async () => {
        set_is_loading_table(true);

        const data = await InpatientApi.GetInpatientLabResults(patno);

        dispatch(InpatientActions.SetLabResults(data));

        set_is_loading_table(false);
      };

      mounted && fetch();

      return () => {
        mounted = false;
      };
    }, [dispatch, patno]);

    useEffect(() => {
      if (!!inpatient_lab_result) {
        const files: IPdf[] = [];
        files.push({
          doc_title: `${
            !!inpatient_lab_result?.doc_remarks
              ? `${inpatient_lab_result?.doc_remarks} | `
              : ``
          }  ${inpatient_lab_result?.doc_filename}`,
          file: inpatient_lab_result?.blob_file,
        });

        set_pdf_files(files);
      } else {
        set_pdf_files([]);
      }
    }, [inpatient_lab_result]);

    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box style={{ height: 500, width: "100%" }}>
              <DataGrid
                getRowId={(e) => e.ftpuploadkey ?? ``}
                density="compact"
                rows={inpatient_lab_results ?? []}
                columns={columns}
                loading={is_loading_table}
                disableSelectionOnClick
              />
            </Box>
          </Grid>

          {!!inpatient_lab_result && (
            <PreviewPDF
              handleClose={() => {
                dispatch(InpatientActions.SetLabResult());
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

export default InpatientManageTabLabResult;
