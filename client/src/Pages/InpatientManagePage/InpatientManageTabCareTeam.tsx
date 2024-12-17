import { Box, Checkbox, Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import InpatientApi from "../../Contexts/Apis/InpatientApi";
import { RootStore } from "../../Contexts/Store";
import { InpatientCareTeamDto } from "../../Interfaces/CareTeamInterfaces";
import DateUtils from "../../Utils/DateUtils";

interface InpatientManageTabCareTeamProps {
  patno: string;
}

const InpatientManageTabCareTeam: FC<InpatientManageTabCareTeamProps> = memo(
  ({ patno }) => {
    const dispatch = useDispatch();

    const { inpatient_care_teams } = useSelector(
      (store: RootStore) => store.InpatientReducer
    );

    const [is_loading_table, set_is_loading_table] = useState<boolean>(false);
    const columns: GridColDef<InpatientCareTeamDto>[] = [
      {
        field: "docname",
        headerName: "Doctor",
        editable: false,
        flex: 1,
      },
      {
        field: "admdoctag ",
        headerName: "Tag",
        editable: false,
        flex: 1,
        renderCell: ({ row }) => {
          return row.admdoctag === `A`
            ? "Attending"
            : row.admdoctag === `F`
            ? "Assisting"
            : "";
        },
      },

      {
        field: "servicebegin",
        headerName: "Service Start",
        editable: false,
        type: `dateTime`,
        flex: 1,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.servicebegin, "-");
        },
      },

      {
        field: "serviceend",
        headerName: "Service End",
        editable: false,
        type: `dateTime`,
        flex: 1,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.serviceend, "-");
        },
      },
      {
        field: "maindoctor ",
        headerName: "Main",
        editable: false,
        flex: 1,
        align: `center`,
        headerAlign: `center`,
        minWidth: 130,
        maxWidth: 130,
        renderCell: ({ row }) => {
          return (
            <Checkbox readOnly checked={row.maindoctor === 1} size="small" />
          );
        },
      },
    ];

    useEffect(() => {
      let mounted = true;
      const fetch = async () => {
        set_is_loading_table(true);

        const data = await InpatientApi.GetInpatientCareTeams(patno);

        dispatch(InpatientActions.SetInpatientCareTeams(data));

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
                getRowId={(e) => e.key}
                density="compact"
                rows={inpatient_care_teams ?? []}
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

export default InpatientManageTabCareTeam;
