import { Grid, TextField, Typography } from "@mui/material";
import { FC, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootStore } from "../../Contexts/Store";
import DateUtils from "../../Utils/DateUtils";
import StringUtil from "../../Utils/StringUtil";

interface StudyManagePagePatientInfoProps {
  radresultno: string;
}

const StudyManagePagePatientInfo: FC<StudyManagePagePatientInfoProps> = memo((props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { study_patient, study } = useSelector((store: RootStore) => store.StudyReducer);

  return (
    // <Paper >
    <Grid container rowSpacing={2} columnSpacing={2}>
      <Grid item xs={12}>
        <Typography component={"div"} className="form-separator">
          Patient Details
        </Typography>
      </Grid>

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
          label="Patient Number"
          value={StringUtil.ReplaceNull(study_patient?.patno, "-")}
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
          label="Patient Name"
          value={StringUtil.ReplaceNull(
            (study_patient?.admlastname ?? "") + ", " + (study_patient?.admfirstname ?? "") + " " + (study_patient?.admmiddlename ?? ""),
            "-"
          )}
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
          value={DateUtils.ReplaceDateUtil(study_patient?.birthdate, "-") + " (" + StringUtil.ReplaceNull(study_patient?.age, "-") + " y/o)"}
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
          value={`${StringUtil.ReplaceNull(study_patient?.nsunit, "-")} | ${StringUtil.ReplaceNull(
            study_patient?.roomcode,
            "-"
          )} | ${StringUtil.ReplaceNull(study_patient?.bedno, "-")}`}
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

      <Grid item xs={12} sm={6} md={3} lg={2}>
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
      </Grid>

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
      <Grid item xs={12}>
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
          label="Doctor"
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
