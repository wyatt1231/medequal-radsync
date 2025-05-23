import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import { FC, memo } from "react";
import { useSelector } from "react-redux";
import { RootStore } from "../../Contexts/Store";
import DateUtils from "../../Utils/DateUtils";
import StringUtil from "../../Utils/StringUtil";

interface StudyManagePagePatientInfoProps {
  radresultno: string;
  isExpanded: boolean;
  onClickToggleExpand: () => void;
}

const StudyManagePagePatientInfo: FC<StudyManagePagePatientInfoProps> = memo((props) => {
  const { study_patient, study } = useSelector((store: RootStore) => store.StudyReducer);

  return (
    // <Paper >
    <Grid container rowSpacing={2} columnSpacing={2}>
      <Grid item xs={12}>
        <Typography component={"div"} className="form-separator">
          <Box display={`grid`} gridAutoColumns={`1fr auto`} gridAutoFlow={`column`}>
            <Box
              display={`grid`}
              gridAutoFlow={`column`}
              gap={`1em`}
              justifyContent={`start`}
              justifyItems={`start`}
              alignItems={`center`}
              alignContent={`center`}
            >
              <span>Patient Details</span>
              <span> - </span>
              <span>{StringUtil.ReplaceNull(study_patient?.patno, "-")}</span>
              <span>|</span>
              <b>{StringUtil.ReplaceNull(study_patient?.patientname ?? "", "-")}</b>
            </Box>

            <Box justifySelf={`end`}>
              <IconButton title={props.isExpanded ? "Expand" : "Collapse"} onClick={props.onClickToggleExpand} size={"small"}>
                {props.isExpanded ? <ExpandMoreIcon fontSize="small" color="primary" /> : <ExpandLessIcon fontSize="small" color="primary" />}
              </IconButton>
            </Box>
          </Box>
        </Typography>
      </Grid>

      {props.isExpanded && (
        <>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label="Hospital Number"
              value={StringUtil.ReplaceNull(study_patient?.hospitalno, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label="Birth Date"
              value={DateUtils.ReplaceDateUtil(study_patient?.birthdate, "-") + " | " + StringUtil.ReplaceNull(study_patient?.age, "-") + " y/o"}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3} lg={2}>
            <TextField
              label="NS | Room | Bed"
              value={study_patient?.nsroombed}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label="Sex"
              value={study_patient?.sex === `F` ? `Female` : study_patient?.sex === `M` ? "Male" : "-"}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label="Address"
              value={StringUtil.ReplaceNull(study_patient?.address, "")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label="Contact No."
              value={StringUtil.ReplaceNull(study_patient?.mobileno, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3} lg={2}>
            <TextField
              label="Admission Date"
              value={DateUtils.ReplaceDateTimeUtil(study_patient?.admissiondate, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3} lg={2}>
            <TextField
              label="Discharge Date"
              value={DateUtils.ReplaceDateTimeUtil(study_patient?.dischargedate, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3} lg={2}>
            <TextField
              label="Chief Complaint"
              value={StringUtil.ReplaceNull(study_patient?.chiefcomplaint, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          {/* 
        <Grid item xs={12}>
          <Typography component={"div"}>Study Details</Typography>
        </Grid> */}

          {/* <Grid item xs={12} sm={6} md={3} lg={2}>
        <TextField
          label="Result Number"
          value={StringUtil.ReplaceNull(study?.radresultno, "-")}
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
            <TextField
              label="Urgency"
              value={StringUtil.ReplaceNull(study?.urgency, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label="Modality"
              value={StringUtil.ReplaceNull(study?.modality, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label="Study Date"
              value={DateUtils.ReplaceDateTimeUtil(study?.studydate, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          {/* sm={6} md={3} lg={4} */}
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label="Admission Diagnosis"
              value={StringUtil.ReplaceNull(study_patient?.admdiagnosis, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label="Patient History"
              value={StringUtil.ReplaceNull(study_patient?.radhistory, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label="Referring Physician"
              value={StringUtil.ReplaceNull(study?.referringdoc, "-")}
              fullWidth
              variant="standard"
              multiline
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          </Grid>
        </>
      )}

      {/* <Grid item xs={12}>
        <TextField
          label="Study Link"
          value={StringUtil.ReplaceNull(study?.study_link, "-")}
          fullWidth
          variant="standard"
          multiline
          InputProps={{
            readOnly: true,
            disableUnderline: true,
          }}
        />
      </Grid> */}

      {/* https://192.168.1.55/ZFP?mode=Proxy#view&pid=00094785&san=240018983&un=zfpopenapi&pw=YRLj8mqXPmkT7fTy44cjzIaoEca9rquhTY%2fkkl%2fOVdCZp4bWSQdw2bcRq7RujyjUrth7SPJP5ftYW3eQNUfd1g%3d%3d */}
    </Grid>
    // </Paper>
  );
});

export default StudyManagePagePatientInfo;
