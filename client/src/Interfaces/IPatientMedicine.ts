import { Moment } from "moment";

export interface MedicineDto {
  dangerous?: number;
  ams?: number;
  highalert?: number;
  medcode?: string;
  patno?: string;
  stockcode?: string;
  stockdesc?: string;
  dosecode?: string;
  freqdesc?: string;
  datestarted?: Moment | string;
  datestopped?: Moment | string;
  reqdoccode?: string;

  chargeqty?: number;
  price?: number;
  amount?: number;
  genname?: string;
  route_med?: string;
  freqqty?: number;
}

export interface MedicineFormulatoryDto {
  stockcode?: string;
  stockdesc?: string;
  indication?: string;
  dosemed?: string;
  contraindi?: string;
  doseadj?: string;
  precaution?: string;
  reaction?: string;
  interaction?: string;
  adminmed?: string;
  mechaction?: string;
  prenancycat?: string;
  stability?: string;
}
