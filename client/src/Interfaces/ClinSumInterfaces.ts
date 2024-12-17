export interface IClinSumEntity {
  patno?: string;
  chiefcomplaint?: string;
  briefhistory?: string;
  pasthistory?: string;
  admdiagnosis?: string;
  encodedby?: string;
  dateencoded?: string;
}

export interface IUpdateClinSumDto {
  chiefcomplaint: string;
  briefhistory: string;
  pasthistory?: string;
}
