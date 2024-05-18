// src/api.js
import axios from 'axios';
import { useError } from './features/errors/ErrorContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/dashboard/', // замените на URL вашего API
});

const useAxiosInterceptor = () => {
  const { setError } = useError();

  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401 && error.response.data.message === 'Signature has expired') {
        setError('Your session has expired. Please log in again.');
      }
      return Promise.reject(error);
    }
  );
};

export { api, useAxiosInterceptor };
