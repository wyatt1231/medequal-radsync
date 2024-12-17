import { Dispatch } from "react";
import { InpatientCareTeamDto } from "../../Interfaces/CareTeamInterfaces";
import { InpatientDto } from "../../Interfaces/InpatientInterfaces";
import { MedicineFormulatoryDto } from "../../Interfaces/IPatientMedicine";
import { InpatientDietOrderDto } from "../../Interfaces/PatientDietOrderInterfaces";
import { LabResultDto } from "../../Interfaces/PatientLabResultInterfaces";
import { PatientProcedureDto } from "../../Interfaces/PatientProcInterfaces";
import { IResponseDto } from "../../Interfaces/ResponseInterfaces";
import InpatientApi from "../Apis/InpatientApi";
import { DialogConfig } from "../Types/ConfigTypes";
import { InpatientReducerTypes } from "../Types/InpatientTypes";
import { PageReducerTypes } from "../Types/PageTypes";

const SetInpatients =
  (filter: InpatientDto, loadingCallback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
    loadingCallback && loadingCallback(true);
    const data = await InpatientApi.GetInpatients(filter);

    dispatch({
      type: "set_inpatients",
      inpatients: data,
    });

    loadingCallback && loadingCallback(false);
  };

const SetNurseStations = () => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_inpatient_nurse_stations_loading",
    inpatient_nurse_stations_loading: true,
  });
  const response = await InpatientApi.GetNurseStations();

  if (response?.success === true) {
    dispatch({
      type: "set_inpatient_nurse_stations",
      inpatient_nurse_stations: response.data,
    });
  }

  dispatch({
    type: "set_inpatient_nurse_stations_loading",
    inpatient_nurse_stations_loading: false,
  });
};

const SetInpatient =
  (patno: string, loadingCallback?: (is_loading: boolean) => void, errorCallback?: () => void) =>
  async (dispatch: Dispatch<InpatientReducerTypes | PageReducerTypes>) => {
    !!loadingCallback && loadingCallback(true);
    try {
      const response = await InpatientApi.GetInpatient(patno);
      dispatch({
        type: "set_inpatient_info",
        inpatient_info: response,
      });
    } catch (error) {
      const response_data: IResponseDto = error?.response?.data;
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response_data?.message ?? ``,
          options: {
            variant: `error`,
          },
        },
      });

      !!errorCallback && errorCallback();
    }
    !!loadingCallback && loadingCallback(false);
  };

const SetInpatientClinSum =
  (patno: string, loading_callback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
    typeof loading_callback === "function" && loading_callback(true);
    const response = await InpatientApi.GetInpatientClinSum(patno);
    typeof loading_callback === "function" && loading_callback(false);
    dispatch({
      type: "set_inpatient_clin_sum",
      inpatient_clin_sum: response,
    });
  };

//

const SetInpHistory = (data: InpatientDto[]) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_inpatient_history",
    inpatient_history: data,
  });
};

//
const SetMedications = (patno: string, loadingCallback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  if (typeof loadingCallback === "function") {
    loadingCallback(true);
  }

  try {
    const response = await InpatientApi.GetMedications(patno);
    console.log(`SetMedications`, response);
    dispatch({
      type: "set_medications",
      medications: response,
    });
  } catch (error) {}

  if (typeof loadingCallback === "function") {
    loadingCallback(false);
  }
};

const SetMedicationDialog = (config?: DialogConfig) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_medication_dialog",
    medication_dialog: !!config
      ? config
      : {
          is_open: false,
          title: ``,
        },
  });
};

const SetInpatientMedication =
  (patno: string, medcode: string, loading_callback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
    typeof loading_callback === "function" && loading_callback(true);
    const response = await InpatientApi.GetMedication(patno, medcode);
    typeof loading_callback === "function" && loading_callback(false);
    dispatch({
      type: "set_inpatient_medication",
      inpatient_medication: response,
    });
  };

//#endregion MEDICINE FORMULATORY

const SetMedicationFormulatoryDialog = (config?: DialogConfig) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_medicine_formulatory_dialog",
    medicine_formulatory_dialog: !!config
      ? config
      : {
          is_open: false,
          title: ``,
        },
  });
};

const SetMedicationFormulatory = (data: MedicineFormulatoryDto, medcode: string) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_medicine_formulatory",
    medicine_formulatory: data,
  });
};

//#endregion

//
const SetInpatientProcedures = (data: PatientProcedureDto[]) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_inpatient_procedures",
    inpatient_procedures: data,
  });
};

const SetInpatientProcedure =
  (patno: string, resultno: string, loading_callback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
    typeof loading_callback === "function" && loading_callback(true);
    const response = await InpatientApi.GetInpatientProcedure(patno, resultno);
    typeof loading_callback === "function" && loading_callback(false);
    dispatch({
      type: "set_inpatient_procedure",
      inpatient_procedure: response,
    });
  };

//
const SetInpatientVitalSign =
  (patno: string, loading_callback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
    typeof loading_callback === "function" && loading_callback(true);
    const response = await InpatientApi.GetInpatientVitalSign(patno);
    typeof loading_callback === "function" && loading_callback(false);
    dispatch({
      type: "set_inpatient_vital_sign",
      inpatient_vital_sign: response,
    });
  };

//
const SetInpatientCareTeams = (data: InpatientCareTeamDto[]) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  data?.forEach((p, i) => (p.key = i));

  dispatch({
    type: "set_inpatient_care_teams",
    inpatient_care_teams: data,
  });
};

//
const SetInpatientDietOrders = (data: InpatientDietOrderDto[]) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  data?.forEach((p, i) => {
    p.id = i;
  });

  dispatch({
    type: "set_inpatient_diet_orders",
    inpatient_diet_orders: data,
  });
};

//#region COURSE WARD

const SetCourseWards = (patno: string, loadingCallback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  loadingCallback && loadingCallback(true);
  const response = await InpatientApi.GetCourseWards(patno);
  loadingCallback && loadingCallback(false);

  dispatch({
    type: "set_course_wards",
    course_wards: response,
  });
};

const SetCourseWard =
  (patno: string, cw_key: number, loadingCallback?: (is_loading: boolean) => void, successCallback?: () => void) =>
  async (dispatch: Dispatch<InpatientReducerTypes>) => {
    loadingCallback && loadingCallback(true);
    const response = await InpatientApi.GetCourseWard(patno, cw_key);
    loadingCallback && loadingCallback(false);
    dispatch({
      type: "set_course_ward",
      course_ward: response,
    });

    successCallback && successCallback();
  };

const SetCourseWardDialog = (config?: DialogConfig) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_course_ward_dialog",
    course_ward_dialog: !!config
      ? config
      : {
          is_open: false,
          title: ``,
        },
  });
};

//#endregion

//#region DOCTOR'S ORDER

const SetDoctorOrders = (patno: string, loading_callback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  loading_callback && loading_callback(true);
  const response = await InpatientApi.GetDoctorOrders(patno);
  loading_callback && loading_callback(false);

  dispatch({
    type: "set_doctor_orders",
    doctor_orders: response,
  });
};

const SetDoctorOrder =
  (patno: string, cw_key: number, loadingCallback?: (is_loading: boolean) => void, successCallback?: () => void) =>
  async (dispatch: Dispatch<InpatientReducerTypes>) => {
    loadingCallback && loadingCallback(true);
    const response = await InpatientApi.GetCourseWard(patno, cw_key);
    loadingCallback && loadingCallback(false);
    dispatch({
      type: "set_doctor_order",
      doctor_order: response,
    });

    successCallback && successCallback();
  };

const SetDoctorOrderDialog = (config?: DialogConfig) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_doctor_order_dialog",
    doctor_order_dialog: !!config
      ? config
      : {
          is_open: false,
          title: ``,
        },
  });
};

//#endregion

const SetLabResults = (data: LabResultDto[]) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_inpatient_lab_results",
    inpatient_lab_results: data,
  });
};

const SetLabResult = (data?: LabResultDto) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_inpatient_lab_result",
    inpatient_lab_result: data,
  });
};

const SetInpatientChart = (data?: LabResultDto) => async (dispatch: Dispatch<InpatientReducerTypes>) => {
  dispatch({
    type: "set_inpatient_chart",
    inpatient_chart: data,
  });
};

const InpatientActions = {
  SetInpatients,
  SetNurseStations,
  SetInpatient,
  SetInpHistory,
  //
  SetInpatientClinSum,
  //
  SetMedications,
  SetMedicationDialog,

  SetInpatientMedication,
  //
  SetMedicationFormulatoryDialog,
  SetMedicationFormulatory,
  //
  SetDoctorOrders,
  SetDoctorOrder,
  SetDoctorOrderDialog,
  //
  SetInpatientProcedures,
  SetInpatientProcedure,
  SetInpatientVitalSign,
  SetInpatientCareTeams,
  SetInpatientDietOrders,
  //
  SetCourseWards,
  SetCourseWard,
  SetCourseWardDialog,
  //
  SetLabResults,
  SetLabResult,
  //
  SetInpatientChart,
};

export default InpatientActions;
