import { Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/system";
import { FC, memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import PageActions from "../../Contexts/Actions/PageActions";
import CourseWardDialog from "./CourseWardDialog";
import DoctorOrderDialog from "./DoctorOrderDialog";
import InpatientInfo from "./InpatientInfo";
import InpatientTabCtnr from "./InpatientManageTab";
import MedicineDialog from "./InpatientMedicationDialog";
import InpatientMedicationFormulatoryDialog from "./InpatientMedicationFormulatoryDialog";
import InpatientManagPageUi from "./Styles/InpatientManagePageUi";

interface InpatientManagePageProps {}

interface InpatientManagePageParamsProps {
  patno: string;
}

const InpatientManagePage: FC<InpatientManagePageProps> = memo(() => {
  const theme = useTheme();
  const params = useParams<InpatientManagePageParamsProps>();
  const { patno } = params;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      PageActions.SetPageLinks([
        {
          to: `/inpatients`,
          label: `Inpatients`,
        },
        {
          to: window.location.pathname,
          label: patno,
        },
      ])
    );
  }, [dispatch, patno]);

  const [active_tab, set_active_tab] = useState(0);

  const handleSetActiveTab = (i: number) => {
    set_active_tab(i);
  };

  return (
    <InpatientManagPageUi theme={theme}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Paper className="content-ctnr">
            <InpatientInfo patno={patno} active_tab={active_tab} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className="content-ctnr">
            <InpatientTabCtnr
              patno={patno}
              handleSetActiveTab={handleSetActiveTab}
            />
          </Paper>
        </Grid>
      </Grid>

      <MedicineDialog patno={patno} />

      <InpatientMedicationFormulatoryDialog />

      <CourseWardDialog patno={patno} />

      <DoctorOrderDialog patno={patno} />
    </InpatientManagPageUi>
  );
});

export default InpatientManagePage;
