import { InpatientDto } from "../../Interfaces/InpatientInterfaces";
import { StudyDto, StudyTemplateDto } from "../../Interfaces/StudyInterfaces";

export type StudyReducerTypes =
  | {
      type: "set_studys";
      studys?: StudyDto[];
    }
  | {
      type: "set_study";
      study: StudyDto;
    }
  | {
      type: "set_study_patient";
      study_patient: InpatientDto;
    }
  | {
      type: "set_study_impression";
      study_impression: StudyDto;
    }
  | {
      type: "set_study_templates";
      study_templates?: StudyTemplateDto[];
    }
  | {
      type: "set_study_prevs";
      study_prevs?: StudyDto[];
    };

export interface StudyReducerModel {
  studys?: StudyDto[];
  study?: StudyDto;
  study_patient?: InpatientDto;
  study_impression?: StudyDto;
  study_templates?: StudyTemplateDto[];
  study_prevs?: StudyDto[];
}
