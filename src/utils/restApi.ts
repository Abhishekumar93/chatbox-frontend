/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { RestApiEnum } from '@/interfaceAndTypes/restApi';
import { removeLocalStorage } from './localStorage';
import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { ROUTE_URLS } from '@/constants/routeUrls';

const { LOGIN, REGISTER } = ROUTE_URLS;

const commonHeaderData = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const buildUrl = (apiUrl: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_DOMAIN;
  return `${baseUrl}${apiUrl}`;
};

const axiosInstance: AxiosInstance = axios.create({
  headers: commonHeaderData,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      ![LOGIN, REGISTER].includes(window.location.href)
    ) {
      let logOutResponseStatus = 400;
      postApi('/api/auth/logout').then(
        (response) => (logOutResponseStatus = response.status),
      );
      if (logOutResponseStatus === 200) {
        window.location.href = LOGIN;
        removeLocalStorage(LOCAL_STORAGE_KEY.LOGGED_IN_USER_DATA);
      }
    }
    const errorResponse = error?.response;
    return Promise.reject({
      message: errorResponse?.data?.message,
      responseCode: errorResponse?.status,
    });
  },
);

const restApi = async (
  method: RestApiEnum,
  apiUrl: string,
  body: any = {},
  headers: Record<string, string> = {},
) => {
  const config: AxiosRequestConfig = {
    method,
    url: buildUrl(apiUrl),
    headers: {
      ...headers,
    },
    data: body,
    withCredentials: true,
  };

  const response = await axiosInstance(config);
  return response;
};

export const postApi = (apiUrl: string, body: any = {}, headers: any = {}) =>
  restApi(RestApiEnum.POST, apiUrl, body, headers);

export const getApi = (apiUrl: string, headers: any = {}) =>
  restApi(RestApiEnum.GET, apiUrl, {}, headers);

export const putApi = (apiUrl: string, body: any = {}, headers: any = {}) =>
  restApi(RestApiEnum.PUT, apiUrl, body, headers);
