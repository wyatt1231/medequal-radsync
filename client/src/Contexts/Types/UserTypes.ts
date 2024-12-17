import { IUserEntity } from "../../Interfaces/UserInterfaces";

export type UserReducerTypes = {
  type: "set_loggedin_user";
  loggedin_user: IUserEntity;
};

export interface UserReducerModel {
  loggedin_user?: IUserEntity;
}
