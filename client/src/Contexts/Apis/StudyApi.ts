import { Axios, FetchJsonHeader } from "../../Config/ApiConfig";
import { SERVER_URL } from "../../Config/Config";
import { InpatientDto } from "../../Interfaces/InpatientInterfaces";

import { StudyDto } from "../../Interfaces/StudyInterfaces";

const BASE_URL = `api/study`;

const GetStudies = async (): Promise<StudyDto[]> => {
  const response = await Axios.get(SERVER_URL + BASE_URL, {
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

const StudyApi = {
  GetStudies,
  GetStudy,
  GetStudyPatient,
  GetStudyImpression,
  UpdateStudyImpression,
};

export default StudyApi;
