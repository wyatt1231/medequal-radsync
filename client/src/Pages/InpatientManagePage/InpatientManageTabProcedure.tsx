import { Box, Grid } from "@mui/material";
import { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import { RootStore } from "../../Contexts/Store";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CollapseIconBotton from "../../Components/CollapseIconButton/CollapseIconButtonUi";
import PageActions from "../../Contexts/Actions/PageActions";
import InpatientApi from "../../Contexts/Apis/InpatientApi";
import { PatientProcedureDto } from "../../Interfaces/PatientProcInterfaces";
import DateUtils from "../../Utils/DateUtils";

interface InpatientManageTabProcedureProps {
  patno: string;
}

const InpatientManageTabProcedure: FC<InpatientManageTabProcedureProps> = memo(
  ({ patno }) => {
    const dispatch = useDispatch();

    const { inpatient_procedures } = useSelector(
      (store: RootStore) => store.InpatientReducer
    );

    const [is_loading_table, set_is_loading_table] = useState<boolean>(false);
    const columns: GridColDef<PatientProcedureDto>[] = [
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

          if (row.initial === `RAD`) {
            return (
              <CollapseIconBotton
                iconColor="primary"
                buttonColor="primary"
                buttons={[
                  {
                    text: "View Result",
                    handleClick: async () => {
                      dispatch(PageActions.SetLoading(true));
                      try {
                        const link =
                          await InpatientApi.GetInpatientProcedureResultLink(
                            patno,
                            row.resultno
                          );
                        window.open(link, "_blank", "noopener,noreferrer");
                      } catch (error) {
                        dispatch(PageActions.SetHttpErrorPrompt(error));
                      }
                      dispatch(PageActions.SetLoading(false));
                    },
                  },
                ]}
              />
            );
          }
        },
      },
      {
        field: "csdate",
        headerName: "CS Date",
        editable: false,
        type: `dateTime`,
        flex: 1,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.csdate, "-");
        },
      },
      {
        field: "initial",
        headerName: "Initial",
        editable: false,
        flex: 1,
      },
      {
        field: "procdesc",
        headerName: "Description",
        editable: false,
        flex: 1,
      },
      {
        field: "reqdoc",
        headerName: "Doctor",
        editable: false,
        flex: 1,
      },
      {
        field: "remarks",
        headerName: "Remarks",
        editable: false,
        flex: 1,
      },
      {
        field: "status",
        headerName: "Status",
        editable: false,
        flex: 1,
      },
    ];

    useEffect(() => {
      let mounted = true;
      const fetch = async () => {
        set_is_loading_table(true);

        const data = await InpatientApi.GetInpatientProcedures(patno);

        dispatch(InpatientActions.SetInpatientProcedures(data));

        set_is_loading_table(false);
      };

      mounted && fetch();

      return () => {
        mounted = false;
      };
    }, [dispatch, patno]);

    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box style={{ height: 500, width: "100%" }}>
              <DataGrid
                getRowId={(e) => e.id ?? ``}
                density="compact"
                rows={inpatient_procedures ?? []}
                columns={columns}
                loading={is_loading_table}
                disableSelectionOnClick
              />
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }
);

export default InpatientManageTabProcedure;
