import { Moment } from "moment";
import { ICourseWardDto as IWardCourse } from "./CourseWardInterface";
import { MedicineDto } from "./IPatientMedicine";
import { IPatientOb } from "./IPatientOb";
import { IPatientPertinentSigns } from "./IPertinentSigns";
import { IPatientPhysicalExam } from "./IPhysicalExam";
import { IPageDto } from "./PageDto";
import { ISortDto } from "./SortDto";
import { IPatientVitalSign } from "./VitalSignInterfaces";

export interface InpatientDto {
  patno?: string;
  hospitalno?: string;
  admprefix?: string;
  // admlastname?: string;
  // admfirstname?: string;
  // admmiddlename?: string;
  // admsuffix?: string;
  patientname?: string;

  sex?: "M" | "F";
  address?: string;
  birthdate?: Date;
  nsroombed?: string;
  age?: string;
  completeaddress?: string;
  phoneno?: string;
  mobileno?: string;
  emailadd?: string;
  religion?: string;
  nationality?: string;
  admissiondate?: Date;
  dischargedate?: Date;
  howadmit?: string;
  medtype?: string;
  doccounter?: string;
  doccode?: string;
  docname?: string;

  // roomcode?: string;
  // bedno?: string;
  // nsunit?: string;
  // roomin?: string;
  // roomout?: string;
  // statustag?: string;
  // confinement?: string;
  // finaldx?: string;
  doc_desc?: string;
  //   transfer_info?: string;

  patient_type?: string;
  prev_study_link?: string;

  gensurvey?: string;
  chiefcomplaint?: string;
  pasthistory?: string;
  briefhistory?: string;
  admdiagnosis?: string;

  vital_signs?: IPatientVitalSign;
  ob?: IPatientOb;
  medicine?: MedicineDto[];
  pertinent_signs?: IPatientPertinentSigns[];
  physical_exam?: IPatientPhysicalExam[];
  course_ward?: IWardCourse[];
}

export interface GetInpatientsDto {
  patno?: string;
  nsunit?: string;
  admlastname?: string;
  admfirstname?: string;
  admit_from?: Date | null | Moment;
  admit_to?: Date | null | Moment;
  sort: ISortDto;
  page: IPageDto;
}

export interface NurseStationDto {
  nsunit?: string;
  pat_count?: number;
}

export interface GetInpatientsResultDto {
  data: Array<InpatientDto>;
  count: number;
}

export interface GetInpHistoryDto {
  hist_patno?: string;
  admit_from?: Date | null | Moment;
  admit_to?: Date | null | Moment;
  sort: ISortDto;
  page: IPageDto;
}
