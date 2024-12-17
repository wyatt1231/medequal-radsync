import { FC, memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import PageNotFound from "../Components/PageNotFound/PageNotFound";
import ConfigActions from "../Contexts/Actions/ConfigActions";
import UserActions from "../Contexts/Actions/UserActions";
import StudyManagePage from "../Pages/StudyManagePage/StudyManagePage";
import StudyPage from "../Pages/StudyPage/StudyPage";
import UserPasswordPage from "../Pages/UserPasswordPage/UserPasswordPage";

interface DoctorRoutesProps {}

const DoctorRoutes: FC<DoctorRoutesProps> = memo(() => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UserActions.SetLoggedinUser());
    dispatch(ConfigActions.SetHospitalLogo());
    dispatch(ConfigActions.SetHospitalName());
  }, [dispatch]);
  return (
    <>
      <Switch>
        {/* <Route path="/" exact component={InpatientPage} /> */}
        {/* <Route path="/inpatients" exact component={InpatientPage} /> */}
        {/* <Route path="/inpatients/:patno" strict component={InpatientManagePage} /> */}

        {/* <Route path="/study" exact component={StudyPage} > */}
        <Route path="/study" exact component={StudyPage}></Route>
        <Route path="/study/:radresultno" strict component={StudyManagePage} />

        <Route path="/change-password" exact component={UserPasswordPage} />

        <Route>{<PageNotFound />}</Route>
      </Switch>
    </>
  );
});

export default DoctorRoutes;
