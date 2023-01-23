import axios, { AxiosError } from 'axios';

import { setAxiosInstance, getAxiosInstance } from './axios';

export const instance = axios.create({ baseURL: '' });

export function setupExample() {
  setAxiosInstance(instance);

  function handleResponseErrorInterceptor() {
    return getAxiosInstance().interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }
    );
  }

  function handleRequestAuthInterceptor() {
    getAxiosInstance().interceptors.request.use((config) => {
      const token = '';
      if (token && config?.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  }
}
