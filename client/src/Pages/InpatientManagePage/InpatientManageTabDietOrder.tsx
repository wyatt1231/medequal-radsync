import { Box, Checkbox, Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import InpatientApi from "../../Contexts/Apis/InpatientApi";
import { RootStore } from "../../Contexts/Store";
import { InpatientDietOrderDto } from "../../Interfaces/PatientDietOrderInterfaces";
import DateUtils from "../../Utils/DateUtils";

interface InpatientManageTabDietOrderProps {
  patno: string;
}

const InpatientManageTabDietOrder: FC<InpatientManageTabDietOrderProps> = memo(
  ({ patno }) => {
    const dispatch = useDispatch();

    const { inpatient_diet_orders } = useSelector(
      (store: RootStore) => store.InpatientReducer
    );

    const [is_loading_table, set_is_loading_table] = useState<boolean>(false);

    const columns: GridColDef<InpatientDietOrderDto>[] = [
      {
        field: "dkind",
        headerName: "Diet Kind",
        editable: false,
        flex: 1,
      },
      {
        field: "docname",
        headerName: "Doctor",
        editable: false,
        flex: 1,
      },
      {
        field: "dietdate",
        headerName: "Diet Date",
        editable: false,
        type: `dateTime`,
        flex: 1,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.dietdate, "-");
        },
      },
      {
        field: "foodtowatcher ",
        headerName: "Food to Watcher",
        editable: false,
        flex: 1,
        align: `center`,
        headerAlign: `center`,
        minWidth: 130,
        maxWidth: 130,
        renderCell: ({ row }) => {
          return (
            <Checkbox
              readOnly
              checked={row.foodtowatcher !== `N`}
              size="small"
            />
          );
        },
      },
    ];

    useEffect(() => {
      let mounted = true;
      const fetch = async () => {
        set_is_loading_table(true);

        const data = await InpatientApi.GetInpatientDietOrders(patno);

        dispatch(InpatientActions.SetInpatientDietOrders(data));

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
                rows={inpatient_diet_orders ?? []}
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

export default InpatientManageTabDietOrder;
