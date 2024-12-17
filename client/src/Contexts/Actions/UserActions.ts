import { Dispatch } from "react";
import UserApi from "../Apis/UserApi";
import { UserReducerTypes } from "../Types/UserTypes";

const SetLoggedinUser = () => async (dispatch: Dispatch<UserReducerTypes>) => {
  const response = await UserApi.GetLoggedInUser();

  if (response.status === 200 && !!response.data) {
    dispatch({
      type: "set_loggedin_user",
      loggedin_user: response.data,
    });

    if (window.location.pathname === "/login") {
      window.location.href = "/study";
    }
  }
};

const UserActions = {
  SetLoggedinUser,
};

export default UserActions;
