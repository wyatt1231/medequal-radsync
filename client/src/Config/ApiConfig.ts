import axios, { AxiosInstance } from "axios";
import {
  APP_NAME,
  getAccessToken,
  getRefreshToken,
  getUrlHome,
  getUrlLogin,
  removeToken,
} from "./Config";

export const Axios: AxiosInstance = axios.create();

export const FetchAuth = `Bearer ${getAccessToken()}`;

export const FetchJsonHeader = {
  "Content-Type": "application/json",
  Authorization: FetchAuth,
};

export const FetchFormDataHeader = {
  "Content-Type": "multipart/form-data",
  Authorization: FetchAuth,
};

let isRefreshing = false;
let refreshSubscribers: Array<any> = [];

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { config, response } = error;
    const originalRequest = config;

    // if (status === 409) {
    //   // removeToken();
    //   // window.location.href = "/login";
    // }

    if (response?.status === 401) {
      const url = getUrlLogin();

      if (!isRefreshing) {
        isRefreshing = true;

        const refresh_token = getRefreshToken();
        const access_token = getAccessToken();
        if (!!refresh_token && !!access_token) {
          axios
            .post(
              "/api/auth/refresh",
              {
                refresh_token,
                // RefreshToken: refresh_token,
                // rememberme: true,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: FetchAuth,
                },
              }
            )
            .then((response) => {
              localStorage.setItem(
                APP_NAME,
                JSON.stringify({
                  access_token: response.data.access_token,
                  refresh_token: response.data.refresh_token,
                })
              );

              isRefreshing = false;
              onRrefreshed(response.data.access_token);
              refreshSubscribers = [];
            })
            .catch((err) => {
              console.clear();
              removeToken();

              if (
                window.location.pathname !== url &&
                window.location.pathname !== getUrlHome()
              ) {
                window.location.href = url;
              }
              //
            });
        } else {
          if (window.location.pathname !== url) {
            window.location.href = url;
          }
        }
      }

      const retryOrigReq = new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: any) => {
          originalRequest.headers["Authorization"] = FetchAuth;
          resolve(axios(originalRequest));
        });
      });
      return retryOrigReq;
    } else {
      return Promise.reject(error);
    }
  }
);

const subscribeTokenRefresh = (cb: any) => {
  refreshSubscribers.push(cb);
};

const onRrefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
};
