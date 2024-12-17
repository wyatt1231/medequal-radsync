import { Dispatch } from "react";
import ConfigApi from "../Apis/ConfigApi";
import { ConfigReducerTypes } from "../Types/ConfigTypes";

const SetHospitalLogo =
  () => async (dispatch: Dispatch<ConfigReducerTypes>) => {
    dispatch({
      type: "set_loading_hospital_logo",
      loading_hospital_logo: true,
    });
    const response = await ConfigApi.GetHospitalLogo();
    dispatch({
      type: "set_loading_hospital_logo",
      loading_hospital_logo: false,
    });
    if (response.status === 200 && !!response.data) {
      dispatch({
        type: "set_hospital_logo",
        hospital_logo: response.data,
      });
    }
  };

const SetHospitalName =
  () => async (dispatch: Dispatch<ConfigReducerTypes>) => {
    dispatch({
      type: "set_loading_hospital_name",
      loading_hospital_name: true,
    });
    const response = await ConfigApi.GetHospitalName();
    dispatch({
      type: "set_loading_hospital_name",
      loading_hospital_name: false,
    });
    if (response.status === 200 && !!response.data) {
      dispatch({
        type: "set_hospital_name",
        hospital_name: response.data,
      });
    }
  };

const ConfigActions = {
  SetHospitalLogo,
  SetHospitalName,
};

export default ConfigActions;
