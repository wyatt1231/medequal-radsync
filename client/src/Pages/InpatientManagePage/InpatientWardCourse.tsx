import { Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollapseIconBotton from "../../Components/CollapseIconButton/CollapseIconButtonUi";
import CustomDialog from "../../Components/CustomDialog/CustomDialog";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import PageActions from "../../Contexts/Actions/PageActions";
import InpatientApi from "../../Contexts/Apis/InpatientApi";
import { RootStore } from "../../Contexts/Store";
import { ICourseWardDto } from "../../Interfaces/CourseWardInterface";
import DateUtils from "../../Utils/DateUtils";
import StringUtil from "../../Utils/StringUtil";

interface InpatientTabWardCourseProps {
  patno: string;
}

const InpatientTabWardCourse: FC<InpatientTabWardCourseProps> = memo(
  ({ patno }) => {
    const dispatch = useDispatch();

    const { course_wards } = useSelector(
      (store: RootStore) => store.InpatientReducer
    );

    const columns: GridColDef<ICourseWardDto>[] = [
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
        renderCell: (params) => {
          const row = params.row;
          return (
            <CollapseIconBotton
              iconColor="primary"
              buttonColor="primary"
              buttons={[
                {
                  text: "View Reading Mode",
                  handleClick: () => {
                    set_selected_course_ward(row);
                  },
                },
                {
                  text: `Update`,
                  handleClick: async () => {
                    dispatch(PageActions.SetLoading(true));
                    const course_ward = await InpatientApi.GetCourseWard(
                      patno,
                      row.cwkey ?? 0
                    );
                    dispatch(PageActions.SetLoading(false));

                    dispatch(
                      InpatientActions.SetCourseWardDialog({
                        is_open: true,
                        title: `Update Course in the Ward Order/Action`,
                        payload: course_ward,
                        submitCallback: async (data: ICourseWardDto) => {
                          let success = false;
                          dispatch(PageActions.SetLoading(true));

                          try {
                            await InpatientApi.UpdateCourseWard(patno, data);

                            dispatch(
                              PageActions.SetPrompt(
                                `The Course in the Ward has been updated successfully.`,
                                `success`
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
                            await InpatientApi.DeleteCourseWard(
                              patno,
                              row.cwkey ?? 0
                            );

                            dispatch(
                              PageActions.SetPrompt(
                                `The Course in the Ward has been deleted successfully.`,
                                `success`
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
        field: "cwkey",
        headerName: "Counter",
        editable: false,
        flex: 1,
      },
      {
        field: "cworder_action",
        headerName: "Course/Action",
        editable: false,
        flex: 5,
        renderCell: ({ row }) => {
          return (
            <Typography>
              {StringUtil.Ellipses(row.cworder_action, 230, "Not specified")}
            </Typography>
          );
        },
      },
      {
        field: "cwdate",
        headerName: "Date",
        editable: false,
        flex: 2,
        // type: `asdas`,
        renderCell: ({ row }) => {
          return (
            <Typography variant="caption">
              {DateUtils.ReplaceDateUtil(row.cwdate, "-")}
            </Typography>
          );
        },
      },

      //   <TableCell>
      //   <Typography variant="caption">
      //     {StringUtil.Ellipses(
      //       row.cworder_action,
      //       230,
      //       "Not specified"
      //     )}
      //   </Typography>
      // </TableCell>

      // <TableCell>
      //   <Typography variant="caption">
      //     {DateUtils.ReplaceDateUtil(row.cwdate, "-")}
      //   </Typography>
      // </TableCell>
    ];

    const [selected_course_ward, set_selected_course_ward] =
      useState<ICourseWardDto | null>(null);

    const [loading_data_table, set_loading_data_table] = useState(true);

    const setLoadingDataTable = useCallback((is_loading: boolean) => {
      set_loading_data_table(is_loading);
    }, []);

    useEffect(() => {
      let mounted = true;
      const fetchTableData = async () => {
        dispatch(InpatientActions.SetCourseWards(patno, setLoadingDataTable));
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
                getRowId={(e) => e.cwkey ?? -1}
                density="compact"
                rows={course_wards ?? []}
                columns={columns}
                loading={loading_data_table}
                disableSelectionOnClick
              />
            </div>
          </Grid>

          <CustomDialog
            title={`${DateUtils.ReplaceDateUtil(
              selected_course_ward?.cwdate,
              "-"
            )} | ${selected_course_ward?.cwkey}`}
            open={!!selected_course_ward}
            handleClose={() => {
              set_selected_course_ward(null);
            }}
            body={
              <div style={{ margin: `1em .5em` }}>
                <Typography variant="caption">
                  {selected_course_ward?.cworder_action}
                </Typography>
              </div>
            }
            actions={<> </>}
          />
        </Grid>
      </>
    );
  }
);

export default InpatientTabWardCourse;
