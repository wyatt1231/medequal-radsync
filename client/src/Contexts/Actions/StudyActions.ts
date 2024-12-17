import { Dispatch } from "react";
import StudyApi from "../Apis/StudyApi";
import { PageReducerTypes } from "../Types/PageTypes";
import { StudyReducerTypes } from "../Types/StudyTypes";
import PageActions from "./PageActions";

const SetStudys = (loadingCallback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<StudyReducerTypes | PageReducerTypes>) => {
  !!loadingCallback && loadingCallback(true);
  try {
    const data = await StudyApi.GetStudies();
    dispatch({
      type: "set_studys",
      studys: data,
    });
  } catch (error) {
    PageActions.SetHttpErrorPrompt(error);
  }

  !!loadingCallback && loadingCallback(false);
};

const SetStudy =
  (radresultno: string, loadingCallback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<StudyReducerTypes | PageReducerTypes>) => {
    !!loadingCallback && loadingCallback(true);
    try {
      const data = await StudyApi.GetStudy(radresultno);
      dispatch({
        type: "set_study",
        study: data,
      });
    } catch (error) {
      PageActions.SetHttpErrorPrompt(error);
    }

    !!loadingCallback && loadingCallback(false);
  };

const SetStudyPatient =
  (radresultno: string, loadingCallback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<StudyReducerTypes | PageReducerTypes>) => {
    !!loadingCallback && loadingCallback(true);
    try {
      const data = await StudyApi.GetStudyPatient(radresultno);
      dispatch({
        type: "set_study_patient",
        study_patient: data,
      });
    } catch (error) {
      PageActions.SetHttpErrorPrompt(error);
    }

    !!loadingCallback && loadingCallback(false);
  };

const SetStudyImpression =
  (radresultno: string, loadingCallback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<StudyReducerTypes | PageReducerTypes>) => {
    !!loadingCallback && loadingCallback(true);
    try {
      const data = await StudyApi.GetStudyImpression(radresultno);
      dispatch({
        type: "set_study_impression",
        study_impression: data,
      });
    } catch (error) {
      PageActions.SetHttpErrorPrompt(error);
    }

    !!loadingCallback && loadingCallback(false);
  };

const StudyActions = {
  SetStudys,
  SetStudy,
  SetStudyPatient,
  SetStudyImpression,
};

export default StudyActions;
