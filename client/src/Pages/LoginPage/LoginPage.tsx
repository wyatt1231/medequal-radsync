import { useTheme } from "@mui/material";
import React, { FC, memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import ConfigActions from "../../Contexts/Actions/ConfigActions";
import UserActions from "../../Contexts/Actions/UserActions";
import LoginForm from "./components/LoginForm";
import LoginSlider from "./components/LoginSlider";
import LoginPageUi from "./styles/LoginPageUi";

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UserActions.SetLoggedinUser());
    dispatch(ConfigActions.SetHospitalName());
    dispatch(ConfigActions.SetHospitalLogo());
  }, [dispatch]);

  return (
    <LoginPageUi theme={theme}>
      <div className="slider-ctnr">
        <LoginSlider />
      </div>
      <div className="form-ctnr">
        <LoginForm />
      </div>
    </LoginPageUi>
  );
});

export default LoginPage;
