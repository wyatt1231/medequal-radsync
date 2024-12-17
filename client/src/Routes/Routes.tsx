import { FC, memo } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import PageLoader from "../Components/PageLoader";
import PagePrompt from "../Components/PagePrompt/PagePrompt";
import PageSnackbar from "../Components/PageSnackbar";
import Layouts from "../Layouts/Layouts";
import LoginPage from "../Pages/LoginPage/LoginPage";
import DoctorRoutes from "./DoctorRoutes";

interface RoutesProps {}

const Routes: FC<RoutesProps> = memo(() => {
  return (
    <>
      <BrowserRouter>
        <PagePrompt />
        <PageLoader />
        <PageSnackbar />
        <Switch>
          <Route path="/login" exact component={LoginPage} />
          <Layouts>
            <DoctorRoutes />
          </Layouts>
        </Switch>
      </BrowserRouter>
    </>
  );
});

export default Routes;
