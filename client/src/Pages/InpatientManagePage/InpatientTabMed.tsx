import {
  Alert,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../Components/Skeletons/TableSkeleton/TableSkeleton";
import { RootStore } from "../../Contexts/Store";
import { MedicineDto } from "../../Interfaces/IPatientMedicine";
import { ITblColumn } from "../../Interfaces/TableInterfaces";
import DateUtils from "../../Utils/DateUtils";
import StringUtil from "../../Utils/StringUtil";

interface InpatientTabMedProps {
  patno: string;
}

const table_columns: Array<ITblColumn> = [
  {
    label: "Medicine",
    width: 250,
  },
  {
    label: "Frequency",
    width: 250,
  },
  {
    label: "Date Started",
    width: 150,
    fixedWidth: true,
  },
  {
    label: "Date Stopped",
    width: 150,
    fixedWidth: true,
  },
  {
    label: "Dangerous",
    width: 70,
  },
  {
    label: "AMS",
    width: 70,
  },
  {
    label: "High Alert",
    width: 120,
  },
];

const InpatientTabMed: FC<InpatientTabMedProps> = memo(({ patno }) => {
  const dispatch = useDispatch();

  const { medications } = useSelector(
    (store: RootStore) => store.InpatientReducer
  );

  const [data_table, set_data_table] = useState<MedicineDto[]>([]);
  const [loading_data_table, set_loading_data_table] = useState(true);
  const [err_data_table, set_err_data_table] = useState<string>("");

  const setLoadingDataTable = useCallback((is_loading: boolean) => {
    console.log(`set_loading_data_table`, is_loading);
    set_loading_data_table(is_loading);
  }, []);

  const setErrDataTable = useCallback((err_msg?: string) => {
    set_err_data_table(!!err_msg ? err_msg : "");
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchTableData = async () => {
      // dispatch(
      //   InpatientActions.SetMedications(patno, {
      //     err_callback: setErrDataTable,
      //     loading_callback: setLoadingDataTable,
      //   })
      // );
    };

    mounted && fetchTableData();

    return () => {
      mounted = false;
    };
  }, [dispatch, patno, setErrDataTable, setLoadingDataTable]);

  useEffect(() => {
    console.log(`medications`, medications);
    set_data_table(medications ?? []);
  }, [medications]);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper style={{ margin: 1, overflow: `hidden` }}>
            <TableContainer
              style={{
                maxHeight: 450,
              }}
              component={Paper}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {table_columns.map((col) => (
                      <TableCell
                        key={col.label}
                        align={col.align}
                        style={{
                          minWidth: col.width,
                          maxWidth: col.fixedWidth ? col.width : `auto`,
                          width: col.fixedWidth ? col.width : `auto`,
                        }}
                        width={col.width}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <>
                    {!!data_table && !loading_data_table ? (
                      <>
                        {data_table.length < 1 ? (
                          <TableRow>
                            <TableCell
                              align="center"
                              colSpan={table_columns.length}
                            >
                              <Alert severity="info">
                                No records has been found! Kindly check your
                                filters.
                              </Alert>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {data_table?.map((row, index) => (
                              <TableRow key={`${row.stockcode}${index}`}>
                                <TableCell>
                                  {StringUtil.ReplaceNull(row.stockdesc, "-")}
                                </TableCell>
                                <TableCell>
                                  {StringUtil.ReplaceNull(row.freqdesc, "-")}
                                </TableCell>

                                <TableCell>
                                  <Typography variant="caption">
                                    {DateUtils.ReplaceDateUtil(
                                      row.datestarted,
                                      "-"
                                    )}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption">
                                    {DateUtils.ReplaceDateUtil(
                                      row.datestopped,
                                      "-"
                                    )}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {row.dangerous === 0 ? "No" : "Yes"}
                                </TableCell>

                                <TableCell>
                                  {row.ams === 0 ? "No" : "Yes"}
                                </TableCell>
                                <TableCell>
                                  {row.highalert === 0 ? "No" : "Yes"}
                                </TableCell>
                              </TableRow>
                            ))}

                            {/* {data_table.length !== -1 && (
                              <TableRow>
                                <TableCell
                                  colSpan={table_columns.length}
                                  align="center"
                                  valign="middle"
                                >
                                  <Typography
                                    variant="caption"
                                    fontStyle="italic"
                                    color="error"
                                  >
                                    Nothing else follows!
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )} */}
                          </>
                        )}
                      </>
                    ) : (
                      <TableSkeleton numOfRows={10}>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                      </TableSkeleton>
                    )}
                  </>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
});

export default InpatientTabMed;
