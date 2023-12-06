import axios from 'axios';

export const baseURL = 'http://localhost:3000/api/v1/';

export const instance = axios.create({
  baseURL,
  withCredentials: true,
});
