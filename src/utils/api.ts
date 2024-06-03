import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { API_URL } from 'consts';

export const appAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const assignTokenToHeader = (
  config: AxiosRequestConfig,
  accessToken: string | null,
) => {
  if (config.headers && accessToken) {
    config.headers.Authorization = `${accessToken}`;
  }

  return config;
};

// Request interceptor
const requestInterceptor = (config: AxiosRequestConfig) => {
  const accessToken = localStorage.getItem('token');
  return assignTokenToHeader(config, accessToken) as
    | InternalAxiosRequestConfig<any>
    | Promise<InternalAxiosRequestConfig<any>>;
};

// Apply interceptors to http instance
appAxios.interceptors.request.use(requestInterceptor, error => {
  return Promise.reject(error);
});

appAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    //@ts-ignore
    if (response.data.errors) {
      return Promise.reject(response.data);
    }
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);
