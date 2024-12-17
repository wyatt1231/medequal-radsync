import { Dispatch } from "react";
import LibraryApi from "../Apis/LibraryApi";
import { LibraryReducerTypes } from "../Types/LibraryTypes";

const SetMedLibrary =
  (loading_callback?: (is_loading: boolean) => void) =>
  async (dispatch: Dispatch<LibraryReducerTypes>) => {
    typeof loading_callback === "function" && loading_callback(true);
    const response = await LibraryApi.GetMedLibApi();
    typeof loading_callback === "function" && loading_callback(false);
    dispatch({
      type: "set_med_lib",
      med_lib: response,
    });
  };

const SetFreqLibrary =
  (loading_callback?: (is_loading: boolean) => void) =>
  async (dispatch: Dispatch<LibraryReducerTypes>) => {
    typeof loading_callback === "function" && loading_callback(true);
    const response = await LibraryApi.GetFreqLibApi();
    typeof loading_callback === "function" && loading_callback(false);
    dispatch({
      type: "set_freq_lib",
      freq_lib: response,
    });
  };

const LibraryActions = {
  SetMedLibrary,
  SetFreqLibrary,
};

export default LibraryActions;
