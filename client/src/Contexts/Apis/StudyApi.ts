import { Axios, FetchJsonHeader } from "../../Config/ApiConfig";
import { SERVER_URL } from "../../Config/Config";
import { InpatientDto } from "../../Interfaces/InpatientInterfaces";
import { PagingDto } from "../../Interfaces/PagingDtos";

import { StudyDto, StudyTemplateDto } from "../../Interfaces/StudyInterfaces";

const BASE_URL = `api/study`;

const GetStudies = async (filter: PagingDto): Promise<StudyDto[]> => {
  const response = await Axios.post(SERVER_URL + BASE_URL, filter, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

const GetStudy = async (radresultno: string): Promise<StudyDto> => {
  const response = await Axios.get(SERVER_URL + BASE_URL + `/${radresultno}`, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

const GetStudyPatient = async (radresultno: string): Promise<InpatientDto> => {
  const response = await Axios.get(SERVER_URL + BASE_URL + `/${radresultno}/patient`, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

const GetStudyImpression = async (radresultno: string): Promise<StudyDto> => {
  const response = await Axios.get(SERVER_URL + BASE_URL + `/${radresultno}/impression`, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

const UpdateStudyImpression = async (radresultno: string, payload: StudyDto): Promise<StudyDto> => {
  const response = await Axios.put(SERVER_URL + BASE_URL + `/${radresultno}/impression`, payload, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

const UnverifyStudyImpression = async (radresultno: string): Promise<StudyDto> => {
  const response = await Axios.put(
    SERVER_URL + BASE_URL + `/${radresultno}/impression/unverify`,
    {},
    {
      headers: FetchJsonHeader,
    }
  );
  return response.data;
};

//#region TEMPLATE

const GetStudyTemplates = async (): Promise<StudyTemplateDto[]> => {
  const response = await Axios.get(SERVER_URL + BASE_URL + `/template`, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

const AddStudyTemplate = async (payload: StudyTemplateDto): Promise<StudyDto> => {
  const response = await Axios.post(SERVER_URL + BASE_URL + `/template`, payload, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

const UpdateStudyTemplate = async (payload: StudyTemplateDto): Promise<StudyDto> => {
  const response = await Axios.put(SERVER_URL + BASE_URL + `/template`, payload, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

const DeleteStudyTemplate = async (radresultno: string): Promise<StudyDto> => {
  const response = await Axios.delete(SERVER_URL + BASE_URL + `/template/${radresultno}`, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

//#endregion

//#endregion STUDY PREVIOUS

const GetStudyPrevs = async (payload: StudyDto): Promise<StudyDto[]> => {
  const response = await Axios.post(SERVER_URL + BASE_URL + `/prevs`, payload, {
    headers: FetchJsonHeader,
  });
  return response.data;
};

//#endregion

const StudyApi = {
  GetStudies,
  GetStudy,
  GetStudyPatient,
  GetStudyImpression,
  UpdateStudyImpression,
  UnverifyStudyImpression,
  GetStudyTemplates,
  AddStudyTemplate,
  UpdateStudyTemplate,
  DeleteStudyTemplate,
  GetStudyPrevs,
};

export default StudyApi;
