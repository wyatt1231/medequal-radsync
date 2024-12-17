import { Dispatch } from "react";
import { LayoutReducerTypes } from "../Types/LayoutTypes";

const ToggleShowSidebar =
  (show_sidebar: boolean) => async (dispatch: Dispatch<LayoutReducerTypes>) => {
    dispatch({
      type: "toggle_show_sidebar",
      show_sidebar: show_sidebar,
    });
  };

const LayoutActions = {
  ToggleShowSidebar,
};

export default LayoutActions;
