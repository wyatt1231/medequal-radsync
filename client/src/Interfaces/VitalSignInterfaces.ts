import { Moment } from "moment";

export interface IPatientVitalSign {
  patno?: string;
  bloodpresure?: string;
  heartrate?: string;
  resrate?: string;
  temperature?: string;
  height?: string;
  weight?: string;
  bmi?: string;
  encodedby?: string;
  dateencoded?: Moment | Date | string;
}
