const ENV: any = process.env;
export const APP_NAME: string = !!ENV.REACT_APP_NAME ? ENV.REACT_APP_NAME : "";

export const SERVER_URL: string | undefined =
  ENV.NODE_ENV === "development"
    ? ENV.REACT_APP_IS_PROXY === "Y"
      ? "/"
      : ENV.REACT_APP_DEV_SERVER_URL
    : (ENV.REACT_APP_IS_PROXY === "Y") === true
    ? "/"
    : ENV.REACT_APP_PROD_SERVER_URL;

export const getAccessToken = (): string | null => {
  let token: string | null = null;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      token = JSON.parse(temp_storage).access_token;
    }
  } catch (error) {}

  return token;
};

export const getRefreshToken = (): string | null => {
  let token: string | null = null;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      token = JSON.parse(temp_storage).refresh_token.tokenString;
    }
  } catch (error) {}

  return token;
};

export const getRefreshTokenExpiration = (): string | null => {
  let token: string | null = null;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      token = JSON.parse(temp_storage).refresh_token.expireAt;
    }
  } catch (error) {}

  return token;
};

export const removeToken = () => {
  localStorage.removeItem(APP_NAME);
};

export const getUrlHome = () => {
  return ENV.URL_HOME ?? `/`;
};

export const getUrlLogin = () => {
  return ENV.URL_LOGIN ?? `/login`;
};
