import { StudyReducerModel, StudyReducerTypes } from "../Types/StudyTypes";

const defaultState: StudyReducerModel = {};

const StudyReducer = (state: StudyReducerModel = defaultState, action: StudyReducerTypes): StudyReducerModel => {
  switch (action.type) {
    case "set_studys": {
      return {
        ...state,
        studys: action.studys,
      };
    }
    case "set_study": {
      return {
        ...state,
        study: action.study,
      };
    }
    case "set_study_patient": {
      return {
        ...state,
        study_patient: action.study_patient,
      };
    }
    case "set_study_impression": {
      return {
        ...state,
        study_impression: action.study_impression,
      };
    }

    case "set_study_templates": {
      return {
        ...state,
        study_templates: action.study_templates,
      };
    }

    case "set_study_prevs": {
      return {
        ...state,
        study_prevs: action.study_prevs,
      };
    }

    default:
      return state;
  }
};

export default StudyReducer;
