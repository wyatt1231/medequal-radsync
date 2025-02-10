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
  prev_study_link?: string;
  font_size?: string;
}

export interface StudyTemplateDto {
  templateno?: string;
  templatekey?: string;
  templatedesc?: string;
  templatedeschtml?: string;
  font_size?: string;
}

export interface StudyFilterDto {
  days_ago: number;
  // days_ago: 0 | 2;
}
