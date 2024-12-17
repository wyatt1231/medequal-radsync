import {
  LibraryReducerModel,
  LibraryReducerTypes,
} from "../Types/LibraryTypes";

const defaultState: LibraryReducerModel = {};

const LibraryReducer = (
  state: LibraryReducerModel = defaultState,
  action: LibraryReducerTypes
): LibraryReducerModel => {
  switch (action.type) {
    case "set_med_lib": {
      return {
        ...state,
        med_lib: action.med_lib,
      };
    }

    case "set_freq_lib": {
      return {
        ...state,
        freq_lib: action.freq_lib,
      };
    }

    default:
      return state;
  }
};

export default LibraryReducer;
