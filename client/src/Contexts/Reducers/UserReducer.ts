import { UserReducerModel, UserReducerTypes } from "../Types/UserTypes";

const defaultState: UserReducerModel = {};

const UserReducer = (
  state: UserReducerModel = defaultState,
  action: UserReducerTypes
): UserReducerModel => {
  switch (action.type) {
    case "set_loggedin_user": {
      return {
        ...state,
        loggedin_user: action.loggedin_user,
      };
    }

    default:
      return state;
  }
};

export default UserReducer;
