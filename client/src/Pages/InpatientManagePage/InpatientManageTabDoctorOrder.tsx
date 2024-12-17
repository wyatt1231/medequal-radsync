import { Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollapseIconBotton from "../../Components/CollapseIconButton/CollapseIconButtonUi";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import PageActions from "../../Contexts/Actions/PageActions";
import InpatientApi from "../../Contexts/Apis/InpatientApi";
import { RootStore } from "../../Contexts/Store";
import { InpatientDoctorOrderDto } from "../../Interfaces/InpatientDoctorOrderInterfaces";
import DateUtils from "../../Utils/DateUtils";

interface InpatientManageTabDoctorOrderProps {
  patno: string;
}

const InpatientManageTabDoctorOrder: FC<InpatientManageTabDoctorOrderProps> =
  memo(({ patno }) => {
    const dispatch = useDispatch();

    const { doctor_orders } = useSelector(
      (store: RootStore) => store.InpatientReducer
    );

    const columns: GridColDef<InpatientDoctorOrderDto>[] = [
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
        renderCell: ({ row }) => {
          return (
            <CollapseIconBotton
              iconColor="primary"
              buttonColor="primary"
              buttons={[
                {
                  text: `Update`,
                  handleClick: async () => {
                    dispatch(PageActions.SetLoading(true));
                    const doctor_order = await InpatientApi.GetDoctorOrder(
                      patno,
                      row.orderkey ?? 0
                    );
                    dispatch(PageActions.SetLoading(false));

                    dispatch(
                      InpatientActions.SetDoctorOrderDialog({
                        is_open: true,
                        title: `Update Doctor Order`,
                        payload: doctor_order,
                        submitCallback: async (
                          data: InpatientDoctorOrderDto
                        ) => {
                          let success = false;
                          dispatch(PageActions.SetLoading(true));

                          try {
                            await InpatientApi.UpdateDoctorOrder(
                              patno,
                              row.orderkey ?? 0,
                              data
                            );

                            dispatch(
                              PageActions.SetPrompt(
                                `The Doctor's Order has been updated successfully.`,
                                `success`
                              )
                            );
                            dispatch(InpatientActions.SetDoctorOrderDialog());
                            dispatch(
                              InpatientActions.SetDoctorOrders(
                                patno,
                                setLoadingDataTable
                              )
                            );
                          } catch (error: any) {
                            dispatch(PageActions.SetHttpErrorPrompt(error));
                          }

                          dispatch(PageActions.SetLoading(false));

                          return success;
                        },
                      })
                    );
                  },
                },
                {
                  text: "Delete",
                  handleClick: async () => {
                    dispatch(
                      PageActions.SetPageConfirmation({
                        open: true,
                        custom_title: `Are you sure that you want to delete this order/action?`,
                        continueCallback: async () => {
                          dispatch(PageActions.SetLoading(true));

                          try {
                            await InpatientApi.DeleteDoctorOrder(
                              patno,
                              row.orderkey ?? 0
                            );

                            dispatch(
                              PageActions.SetPrompt(
                                `The Doctor's Order has been deleted successfully.`,
                                `success`
                              )
                            );
                            dispatch(InpatientActions.SetDoctorOrderDialog());
                            dispatch(
                              InpatientActions.SetDoctorOrders(
                                patno,
                                setLoadingDataTable
                              )
                            );
                          } catch (error: any) {
                            dispatch(PageActions.SetHttpErrorPrompt(error));
                          }

                          dispatch(PageActions.SetLoading(false));
                        },
                      })
                    );
                  },
                },
              ]}
            />
          );
        },
      },
      {
        field: "ap_order",
        headerName: "AP Order",
        editable: false,
        flex: 1,
      },
      {
        field: "progressnotes",
        headerName: "Progress Notes",
        editable: false,
        flex: 5,
      },
      {
        field: "notedate",
        headerName: "Note Date",
        editable: false,
        flex: 2,
        // type: `asdas`,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.notedate, "-");
        },
      },

      {
        field: "datecreated",
        headerName: "Date Created",
        editable: false,
        flex: 2,
        renderCell: ({ row }) => {
          return DateUtils.ReplaceDateTimeUtil(row.datecreated, "-");
        },
      },
    ];

    const [loading_data_table, set_loading_data_table] = useState(true);

    const setLoadingDataTable = useCallback((is_loading: boolean) => {
      set_loading_data_table(is_loading);
    }, []);

    useEffect(() => {
      let mounted = true;
      const fetchTableData = async () => {
        dispatch(InpatientActions.SetDoctorOrders(patno, setLoadingDataTable));
      };

      mounted && fetchTableData();

      return () => {
        mounted = false;
      };
    }, [dispatch, patno, setLoadingDataTable]);

    return (
      <>
        <Grid container>
          <Grid item xs={12}>
            <div style={{ height: 500, width: "100%" }}>
              <DataGrid
                getRowId={(e) => e.orderkey ?? -1}
                density="compact"
                rows={doctor_orders ?? []}
                columns={columns}
                loading={loading_data_table}
                disableSelectionOnClick
              />
            </div>
          </Grid>
        </Grid>
      </>
    );
  });

export default InpatientManageTabDoctorOrder;
