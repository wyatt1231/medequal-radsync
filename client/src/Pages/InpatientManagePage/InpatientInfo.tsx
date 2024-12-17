import { LoadingButton } from "@mui/lab";
import { Box, Grid, Skeleton, TextField, Typography } from "@mui/material";
import { FC, memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import InpatientActions from "../../Contexts/Actions/InpatientActions";
import PageActions from "../../Contexts/Actions/PageActions";
import InpatientApi from "../../Contexts/Apis/InpatientApi";
import { RootStore } from "../../Contexts/Store";
import { InpatientDoctorOrderDto } from "../../Interfaces/InpatientDoctorOrderInterfaces";
import { InpatientDto } from "../../Interfaces/InpatientInterfaces";
import DateUtils from "../../Utils/DateUtils";
import StringUtil from "../../Utils/StringUtil";

interface InpatientInfoProps {
  patno: string;
  active_tab: number;
}

const InpatientInfo: FC<InpatientInfoProps> = memo(({ patno, active_tab, ...props }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { inpatient_info } = useSelector((store: RootStore) => store.InpatientReducer);

  const [inp_info, set_inp_info] = useState<InpatientDto>();
  const [loading_inp_info, set_loading_inp_info] = useState(false);

  useEffect(() => {
    dispatch(
      InpatientActions.SetInpatient(
        patno,
        (is_loading: boolean) => {
          dispatch(PageActions.SetLoading(is_loading));
        },
        () => {
          history.replace("/inpatients");
        }
      )
    );
  }, [dispatch, history, patno]);

  useEffect(() => {
    set_inp_info(inpatient_info);
  }, [inpatient_info]);

  const elementRef: any = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }

    return () => {};
  }, [inpatient_info]);

  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={4}>
        <Grid item xs={12}>
          <Box ref={elementRef} position={`relative`}>
            {inp_info && (
              <Box
                position={`fixed`}
                //
                width={`calc(100% - ${position.left + 47}px)`}
                style={{
                  backgroundColor: `#fff`,
                  zIndex: 10,
                }}
                padding={`1em 0`}
                borderTop={`2px solid rgba(0, 0, 0, 0.05)`}
                borderBottom={`2px solid rgba(0, 0, 0, 0.05)`}
                marginRight={`1em`}
              >
                <Box
                  display={`grid`}
                  // gridAutoFlow={`column`}
                  gridAutoColumns={`1fr auto`}
                  alignItems={`center`}
                  alignContent={`center`}
                  className="patient-info-actions"
                >
                  <Typography variant="h6">
                    {inp_info && (
                      <>
                        {inp_info?.admlastname}, {inp_info?.admfirstname} {inp_info?.admmiddlename} ({inp_info?.patno})
                      </>
                    )}
                  </Typography>

                  <Box display={`grid`} justifyItems={`end`} justifyContent={`end`} gridAutoFlow={`column`} gap={`1em`}>
                    {active_tab === 0 && (
                      <>
                        <LoadingButton
                          // variant="contained"
                          fullWidth
                          color="primary"
                          type="reset"
                          form="form_instance_claim_form"
                        >
                          Reset Claim Form
                        </LoadingButton>

                        <LoadingButton variant="contained" fullWidth color="primary" type="submit" form="form_instance_claim_form">
                          Save Claim Form
                        </LoadingButton>
                      </>
                    )}

                    {active_tab === 5 && (
                      <LoadingButton
                        variant="contained"
                        fullWidth
                        color="primary"
                        type="button"
                        form="form_instance_doctor_order"
                        onClick={() => {
                          dispatch(
                            InpatientActions.SetDoctorOrderDialog({
                              is_open: true,
                              title: `Add Doctor Order`,
                              submitCallback: async (data: InpatientDoctorOrderDto) => {
                                let success = false;
                                dispatch(PageActions.SetLoading(true));

                                try {
                                  await InpatientApi.AddDoctorOrder(patno, data);

                                  dispatch(PageActions.SetPrompt(`The Doctor's Order has been added successfully.`, `success`));
                                  dispatch(InpatientActions.SetDoctorOrderDialog());

                                  dispatch(InpatientActions.SetDoctorOrders(patno));
                                } catch (error: any) {
                                  dispatch(PageActions.SetHttpErrorPrompt(error));
                                }

                                dispatch(PageActions.SetLoading(false));

                                return success;
                              },
                            })
                          );
                        }}
                      >
                        Add Doctor Order
                      </LoadingButton>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography component={"div"} className="info-title patient-personal-details" marginTop={`3.5em`}>
            Personal Details
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Age"
              value={StringUtil.ReplaceNull(inp_info?.age, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Birth Date"
              value={DateUtils.ReplaceDateUtil(inp_info?.birthdate, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3} lg={2}>
          <TextField
            label="Civil Status"
            value={StringUtil.ReplaceNull(inp_info?.civi, "-")}
            fullWidth
            variant="standard"
            multiline
            InputProps={{
              readOnly: true,
              disableUnderline: true,
            }}
          />
        </Grid> */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Nationality"
              value={StringUtil.ReplaceNull(inp_info?.nationality, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Religion"
              value={StringUtil.ReplaceNull(inp_info?.religion, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Mobile No."
              value={StringUtil.ReplaceNull(inp_info?.mobileno, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Phone No."
              value={StringUtil.ReplaceNull(inp_info?.phoneno, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          {!loading_inp_info ? (
            <TextField
              label="Email Address"
              value={StringUtil.ReplaceNull(inp_info?.emailadd, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          {!loading_inp_info ? (
            <TextField
              label="Permanent Address"
              value={StringUtil.ReplaceNull(inp_info?.completeaddress, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        {/* <Grid item xs={12}>
          <Divider />
        </Grid> */}

        <Grid item xs={12}>
          <Typography component={"div"} className="info-title">
            Admission Details
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Confinement"
              value={StringUtil.ReplaceNull(inp_info?.confinement, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>
        <Grid item xs={12} sm={4} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Hospital Number"
              value={StringUtil.ReplaceNull(inp_info?.hospitalno, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} sm={4} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Room Number"
              value={StringUtil.ReplaceNull(inp_info?.roomcode, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} sm={4} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Bed Number"
              value={StringUtil.ReplaceNull(inp_info?.bedno, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} sm={4} md={3} lg={2}>
          {!loading_inp_info ? (
            <TextField
              label="Nurse Station Unit"
              value={StringUtil.ReplaceNull(inp_info?.nsunit, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={4}>
          {!loading_inp_info ? (
            <TextField
              label="Admission Date"
              value={DateUtils.ReplaceDateTimeUtil(inp_info?.admissiondate, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          {!loading_inp_info ? (
            <TextField
              label="Discharge Date"
              value={DateUtils.ReplaceDateTimeUtil(inp_info?.completeaddress, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          {!loading_inp_info ? (
            <TextField
              label="Medical Type"
              value={StringUtil.ReplaceNull(inp_info?.medtype, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          ) : (
            <Skeleton variant="text" />
          )}
        </Grid>
      </Grid>
    </>
  );
});

export default InpatientInfo;
