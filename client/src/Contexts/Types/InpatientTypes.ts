import { InpatientCareTeamDto } from "../../Interfaces/CareTeamInterfaces";
import { IClinSumEntity } from "../../Interfaces/ClinSumInterfaces";
import { ICourseWardDto } from "../../Interfaces/CourseWardInterface";
import { InpatientDoctorOrderDto } from "../../Interfaces/InpatientDoctorOrderInterfaces";
import {
  InpatientDto,
  NurseStationDto,
} from "../../Interfaces/InpatientInterfaces";
import {
  MedicineDto,
  MedicineFormulatoryDto,
} from "../../Interfaces/IPatientMedicine";
import { InpatientDietOrderDto } from "../../Interfaces/PatientDietOrderInterfaces";
import { LabResultDto } from "../../Interfaces/PatientLabResultInterfaces";
import { PatientProcedureDto } from "../../Interfaces/PatientProcInterfaces";
import { IPatientVitalSign } from "../../Interfaces/VitalSignInterfaces";
import { DialogConfig } from "./ConfigTypes";

export type InpatientReducerTypes =
  | {
      type: "set_inpatient_nurse_stations";
      inpatient_nurse_stations?: Array<NurseStationDto>;
    }
  | {
      type: "set_inpatient_nurse_stations_loading";
      inpatient_nurse_stations_loading: boolean;
    }
  //
  | {
      type: "set_inpatients";
      inpatients?: InpatientDto[];
    }
  | {
      type: "set_inpatients_loading";
      inpatients_loading: boolean;
    }
  //
  | {
      type: "set_inpatient_history";
      inpatient_history?: InpatientDto[];
    }
  | {
      type: "set_inpatient_history_loading";
      inpatient_history_loading: boolean;
    }
  //
  | {
      type: "set_inpatient_info";
      inpatient_info?: InpatientDto;
    }
  | {
      type: "set_inpatient_clin_sum";
      inpatient_clin_sum: IClinSumEntity;
    }
  //
  | {
      type: "set_inpatient_vital_sign";
      inpatient_vital_sign: IPatientVitalSign;
    }
  //
  | {
      type: "set_medications";
      medications: MedicineDto[];
    }
  | {
      type: "set_inpatient_medication";
      inpatient_medication: MedicineDto;
    }
  | {
      type: "set_medication_dialog";
      medication_dialog: DialogConfig;
    }
  //
  | {
      type: "set_medicine_formulatory";
      medicine_formulatory: MedicineFormulatoryDto;
    }
  | {
      type: "set_medicine_formulatory_dialog";
      medicine_formulatory_dialog: DialogConfig;
    }
  //
  | {
      type: "set_doctor_orders";
      doctor_orders: InpatientDoctorOrderDto[];
    }
  | {
      type: "set_doctor_order";
      doctor_order: InpatientDoctorOrderDto;
    }
  | {
      type: "set_doctor_order_dialog";
      doctor_order_dialog: DialogConfig;
    }
  //
  | {
      type: "set_inpatient_procedures";
      inpatient_procedures: PatientProcedureDto[];
    }
  | {
      type: "set_inpatient_procedure";
      inpatient_procedure: PatientProcedureDto;
    }
  //
  | {
      type: "set_inpatient_care_teams";
      inpatient_care_teams: InpatientCareTeamDto[];
    }
  //
  | {
      type: "set_inpatient_diet_orders";
      inpatient_diet_orders: InpatientDietOrderDto[];
    }

  //#region COURSE WARD
  | {
      type: "set_course_wards";
      course_wards: ICourseWardDto[];
    }
  | {
      type: "set_course_ward";
      course_ward: ICourseWardDto;
    }
  | {
      type: "set_course_ward_dialog";
      course_ward_dialog: DialogConfig;
    }
  //#endregion
  | {
      type: "set_inpatient_lab_results";
      inpatient_lab_results: LabResultDto[];
    }
  | {
      type: "set_inpatient_lab_result";
      inpatient_lab_result?: LabResultDto;
    }
  //
  | {
      type: "set_inpatient_chart";
      inpatient_chart?: LabResultDto;
    };

export interface InpatientReducerModel {
  inpatient_nurse_stations?: NurseStationDto[];
  inpatient_nurse_stations_loading: boolean;
  inpatients?: InpatientDto[];
  inpatients_loading: boolean;
  //
  inpatient_history?: InpatientDto[];
  inpatient_history_loading: boolean;
  //
  inpatient_info?: InpatientDto;
  inpatient_clin_sum?: IClinSumEntity;
  inpatient_vital_sign?: IPatientVitalSign;
  medications?: MedicineDto[];
  medication?: MedicineDto;
  medication_dialog?: DialogConfig;
  //
  medicine_formulatory?: MedicineFormulatoryDto;
  medicine_formulatory_dialog?: DialogConfig;
  //
  inpatient_procedures?: PatientProcedureDto[];
  inpatient_procedure?: PatientProcedureDto;
  inpatient_care_teams?: InpatientCareTeamDto[];
  inpatient_diet_orders?: InpatientDietOrderDto[];

  course_wards?: ICourseWardDto[];
  course_ward?: ICourseWardDto;
  course_ward_dialog?: DialogConfig;
  //
  doctor_orders?: InpatientDoctorOrderDto[];
  doctor_order?: InpatientDoctorOrderDto;
  doctor_order_dialog?: DialogConfig;
  //

  inpatient_lab_results?: LabResultDto[];
  inpatient_lab_result?: LabResultDto;
  //
  inpatient_chart?: LabResultDto;
}
