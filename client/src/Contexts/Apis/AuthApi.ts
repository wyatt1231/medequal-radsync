import { SERVER_URL } from "../../Config/Config";
import { Axios, FetchJsonHeader } from "../../Config/ApiConfig";
import { ILoginDto } from "../../Interfaces/AuthInterfaces";

const BASE = `api/auth/`;

const LoginApi = async (payload: ILoginDto) => {
  const response = await Axios.post(SERVER_URL + BASE + `login`, payload, {
    headers: FetchJsonHeader,
  });
  return response;
};

const AuthApi = {
  LoginApi,
};

export default AuthApi;
