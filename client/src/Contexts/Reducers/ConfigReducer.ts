import { ConfigReducerModel, ConfigReducerTypes } from "../Types/ConfigTypes";

const defaultState: ConfigReducerModel = {
  loading_hospital_name: true,
  loading_hospital_logo: true,
};

const ConfigReducer = (
  state: ConfigReducerModel = defaultState,
  action: ConfigReducerTypes
): ConfigReducerModel => {
  switch (action.type) {
    case "set_hospital_name": {
      return {
        ...state,
        hospital_name: action.hospital_name,
      };
    }
    case "set_loading_hospital_name": {
      return {
        ...state,
        loading_hospital_name: action.loading_hospital_name,
      };
    }
    //
    case "set_hospital_logo": {
      return {
        ...state,
        hospital_logo: action.hospital_logo,
      };
    }
    case "set_loading_hospital_logo": {
      return {
        ...state,
        loading_hospital_logo: action.loading_hospital_logo,
      };
    }

    default:
      return state;
  }
};

export default ConfigReducer;
