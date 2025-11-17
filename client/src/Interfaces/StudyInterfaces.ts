export interface StudyDto {
  radresultno?: string;
  resultdate?: string;
  resultdesc?: string;
  radresulthtml?: string;
  resulttag?: string;
  hospitalno?: string;
  patrefno?: string;
  patientname?: string;
  dob?: string;
  sex?: string;
  accessionno?: string;
  studydate?: string;
  procdesc?: string;
  urgency?: string;
  modality?: string;
  reqdoccode?: string;
  referringdoc?: string;
  sourcedept?: string;
  tag?: string;
  csno?: string;
  filmcontrolno?: string;
  deptcode?: string;
  sectioncode?: string;
  dateperformed?: string;
  proccode?: string;
  age?: string;
  birthdate?: string;
  dateencoded?: string;
  //
  study_link?: string;
  font_size?: string;
}

export interface StudyTemplateDto {
  templateno?: string;
  templatekey?: string;
  templatedesc?: string;
  templatedeschtml?: string;
  tempmodality?: string;
  font_size?: string;
}

export interface StudyFilterDto {
  days_ago: number;
  patient_no: string;
  patient_name: string;
  hospital_no: string;
  referring_physician: string;
  study_date_from: string;
  study_date_to: string;
  accession_no: string;
  study_description: string;
  urgency: string[];
  modality: string[];
  status: string[];
  patient_type: string[];
}
