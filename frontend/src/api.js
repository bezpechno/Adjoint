// api.js
import axios from 'axios';
import { useError } from './features/errors/ErrorContext';
import {  useEffect } from 'react';
const api = axios.create({
  baseURL: 'https://your-api-url.com', // Замените на URL вашего API
});

const useAxiosInterceptor = () => {
  const { setError } = useError();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.data && error.response.data.message === 'signature expired') {
          setError('Signature has expired. You will be redirected to the login page.');
          setTimeout(() => {
            window.location.href = '/login'; // Замените на URL страницы авторизации
          }, 5000);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [setError]);
};

export { api, useAxiosInterceptor };
