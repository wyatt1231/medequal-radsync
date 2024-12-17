import { LayoutReducerModel, LayoutReducerTypes } from "../Types/LayoutTypes";

const defaultState: LayoutReducerModel = {
  show_sidebar: false,
};

const LayoutReducer = (
  state: LayoutReducerModel = defaultState,
  action: LayoutReducerTypes
): LayoutReducerModel => {
  switch (action.type) {
    case "toggle_show_sidebar": {
      return {
        ...state,
        show_sidebar: action.show_sidebar,
      };
    }

    default:
      return state;
  }
};

export default LayoutReducer;
