import {
  InpatientReducerModel,
  InpatientReducerTypes,
} from "../Types/InpatientTypes";

const defaultState: InpatientReducerModel = {
  inpatients_loading: true,
  inpatient_nurse_stations_loading: true,
  inpatient_history_loading: true,
};

const InpatientReducer = (
  state: InpatientReducerModel = defaultState,
  action: InpatientReducerTypes
): InpatientReducerModel => {
  switch (action.type) {
    case "set_inpatient_nurse_stations": {
      return {
        ...state,
        inpatient_nurse_stations: action.inpatient_nurse_stations,
      };
    }

    case "set_inpatient_nurse_stations_loading": {
      return {
        ...state,
        inpatient_nurse_stations_loading:
          action.inpatient_nurse_stations_loading,
      };
    }

    case "set_inpatients": {
      return {
        ...state,
        inpatients: action.inpatients,
      };
    }

    case "set_inpatients_loading": {
      return {
        ...state,
        inpatients_loading: action.inpatients_loading,
      };
    }

    //

    case "set_inpatient_history": {
      return {
        ...state,
        inpatient_history: action.inpatient_history,
      };
    }

    case "set_inpatient_history_loading": {
      return {
        ...state,
        inpatient_history_loading: action.inpatient_history_loading,
      };
    }

    //
    case "set_inpatient_info": {
      return {
        ...state,
        inpatient_info: action.inpatient_info,
      };
    }

    case "set_inpatient_clin_sum": {
      return {
        ...state,
        inpatient_clin_sum: action.inpatient_clin_sum,
      };
    }

    case "set_inpatient_vital_sign": {
      return {
        ...state,
        inpatient_vital_sign: action.inpatient_vital_sign,
      };
    }
    //
    case "set_medications": {
      return {
        ...state,
        medications: action.medications,
      };
    }
    case "set_medication_dialog": {
      return {
        ...state,
        medication_dialog: action.medication_dialog,
      };
    }
    case "set_inpatient_medication": {
      return {
        ...state,
        medication: action.inpatient_medication,
      };
    }
    //
    case "set_medicine_formulatory": {
      return {
        ...state,
        medicine_formulatory: action.medicine_formulatory,
      };
    }
    case "set_medicine_formulatory_dialog": {
      return {
        ...state,
        medicine_formulatory_dialog: action.medicine_formulatory_dialog,
      };
    }

    //
    case "set_inpatient_procedures": {
      return {
        ...state,
        inpatient_procedures: action.inpatient_procedures,
      };
    }
    case "set_inpatient_procedure": {
      return {
        ...state,
        inpatient_procedure: action.inpatient_procedure,
      };
    }
    //
    case "set_inpatient_care_teams": {
      return {
        ...state,
        inpatient_care_teams: action.inpatient_care_teams,
      };
    }
    //
    case "set_inpatient_diet_orders": {
      return {
        ...state,
        inpatient_diet_orders: action.inpatient_diet_orders,
      };
    }
    //#region COURSE WARD
    case "set_course_wards": {
      return {
        ...state,
        course_wards: action.course_wards,
      };
    }
    case "set_course_ward_dialog": {
      return {
        ...state,
        course_ward_dialog: action.course_ward_dialog,
      };
    }
    //#endregion

    //#region DOCTOR ORDER
    case "set_doctor_orders": {
      return {
        ...state,
        doctor_orders: action.doctor_orders,
      };
    }
    case "set_doctor_order": {
      return {
        ...state,
        doctor_order: action.doctor_order,
      };
    }
    case "set_doctor_order_dialog": {
      return {
        ...state,
        doctor_order_dialog: action.doctor_order_dialog,
      };
    }
    //#endregion
    case "set_inpatient_lab_results": {
      return {
        ...state,
        inpatient_lab_results: action.inpatient_lab_results,
      };
    }
    case "set_inpatient_lab_result": {
      return {
        ...state,
        inpatient_lab_result: action.inpatient_lab_result,
      };
    }
    //
    case "set_inpatient_chart": {
      return {
        ...state,
        inpatient_chart: action.inpatient_chart,
      };
    }

    default:
      return state;
  }
};

export default InpatientReducer;
