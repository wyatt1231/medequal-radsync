import { SERVER_URL } from "../../Config/Config";
import { Axios, FetchFormDataHeader } from "../../Config/ApiConfig";

const BASE = `api/config/`;

const GetHospitalName = async () => {
  console.log(
    `GetHospitalName SERVER URL`,
    SERVER_URL + BASE + `hospital-name`
  );
  const response = await Axios.get(SERVER_URL + BASE + `hospital-name`, {
    params: null,
    headers: FetchFormDataHeader,
  });
  return response;
};
const GetHospitalLogo = async () => {
  const response = await Axios.get(SERVER_URL + BASE + `hospital-logo`, {
    params: null,
    headers: FetchFormDataHeader,
  });
  return response;
};

const ConfigApi = {
  GetHospitalName,
  GetHospitalLogo,
};

export default ConfigApi;
