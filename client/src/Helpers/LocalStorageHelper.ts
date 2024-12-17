import { LocalStorageTypes } from "../Contexts/Types/LocalStorageTypes";

export const SetLocalStorage = (key: LocalStorageTypes, value: string) => {
  window.localStorage.setItem(key, value);
};

export const GetLocalStorage = (key: LocalStorageTypes) => {
  return window.localStorage.getItem(key);
};
