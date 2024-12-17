export interface InpatientDoctorOrderDto {
  orderkey?: number;
  patno?: string;
  notedate?: any;
  notetype?: EnumDoctorOrderNoteType;
  flag?: EnumDoctorOrderFlag;
  progressnotes?: string;
  ap_order?: string;
  datecreated?: Date;
  createdby?: string;
}

export enum EnumDoctorOrderNoteType {
  Note,
  Order,
  Caution,
}

export enum EnumDoctorOrderFlag {
  Alert,
  Warning,
  ForInfo,
}
