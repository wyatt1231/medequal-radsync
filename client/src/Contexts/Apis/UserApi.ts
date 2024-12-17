import { SERVER_URL } from "../../Config/Config";
import {
  Axios,
  FetchFormDataHeader,
  FetchJsonHeader,
} from "../../Config/ApiConfig";
import { IPasswordDto } from "../../Interfaces/AuthInterfaces";

const BASE = `api/user/`;

const GetLoggedInUser = async () => {
  const response = await Axios.get(SERVER_URL + BASE + ``, {
    params: null,
    headers: FetchFormDataHeader,
  });
  return response;
};

const ChangePassword = async (data: IPasswordDto) => {
  const response = await Axios.post(SERVER_URL + BASE + `password`, data, {
    params: null,
    headers: FetchJsonHeader,
  });
  return response;
};

const UserApi = {
  GetLoggedInUser,
  ChangePassword,
};

export default UserApi;
