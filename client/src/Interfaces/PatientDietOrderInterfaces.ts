import { Moment } from "moment";

export interface InpatientDietOrderDto {
  id?: number;
  patno?: string;
  dkind?: string;
  dietdate?: Date | null | Moment;
  docname?: string;
  foodtowatcher?: string;
}
