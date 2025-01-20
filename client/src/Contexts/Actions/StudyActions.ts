import { Dispatch } from "react";
import { PagingDto } from "../../Interfaces/PagingDtos";
import { StudyDto, StudyTemplateDto } from "../../Interfaces/StudyInterfaces";
import StudyApi from "../Apis/StudyApi";
import { PageReducerTypes } from "../Types/PageTypes";
import { StudyReducerTypes } from "../Types/StudyTypes";
import PageActions from "./PageActions";

const SetStudys =
  (paging: PagingDto, loadingCallback?: (is_loading: boolean) => void) => async (dispatch: Dispatch<StudyReducerTypes | PageReducerTypes>) => {
    !!loadingCallback && loadingCallback(true);
    try {
      const data = await StudyApi.GetStudies(paging);
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
      !!loadingCallback && loadingCallback(false);
    } catch (error) {
      PageActions.SetHttpErrorPrompt(error);
      window.location.replace(`/404`);
    }
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

const SetStudyTemplates =
  (study_templates?: StudyTemplateDto[], loadingCallback?: (is_loading: boolean) => void) =>
  async (dispatch: Dispatch<StudyReducerTypes | PageReducerTypes>) => {
    if (!!study_templates) {
      dispatch({
        type: "set_study_templates",
        study_templates: study_templates,
      });
    } else {
      !!loadingCallback && loadingCallback(true);
      try {
        const data = await StudyApi.GetStudyTemplates();
        dispatch({
          type: "set_study_templates",
          study_templates: data,
        });
      } catch (error) {
        PageActions.SetHttpErrorPrompt(error);
      }
      !!loadingCallback && loadingCallback(false);
    }
  };

const SetStudyPrevs = (study_prevs?: StudyDto[]) => async (dispatch: Dispatch<StudyReducerTypes | PageReducerTypes>) => {
  dispatch({
    type: "set_study_prevs",
    study_prevs: study_prevs,
  });

  console.log(`study_prevs`, study_prevs);
};

const StudyActions = {
  SetStudys,
  SetStudy,
  SetStudyPatient,
  SetStudyImpression,
  SetStudyTemplates,
  SetStudyPrevs,
};

export default StudyActions;
