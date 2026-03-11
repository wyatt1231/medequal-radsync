import { Axios, FetchFormDataHeader } from "../../Config/ApiConfig";
import { SERVER_URL } from "../../Config/Config";
import { GetLibraryDto } from "../../Interfaces/LibraryInterfaces";

const BASE = `api/library/`;

const GetMedLibApi = async (): Promise<Array<GetLibraryDto>> => {
  const response = await Axios.get(SERVER_URL + BASE + `medicine`, {
    headers: FetchFormDataHeader,
  });
  return response.data;
};

const GetFreqLibApi = async (): Promise<Array<GetLibraryDto>> => {
  const response = await Axios.get(SERVER_URL + BASE + `frequency`, {
    headers: FetchFormDataHeader,
  });
  return response.data;
};

const GetModalityMapApi = async (): Promise<Array<GetLibraryDto>> => {
  const response = await Axios.get(SERVER_URL + BASE + `modality`, {
    headers: FetchFormDataHeader,
  });
  return response.data;
};

const LibraryApi = {
  GetMedLibApi,
  GetFreqLibApi,
  GetModalityMapApi,
};

export default LibraryApi;
