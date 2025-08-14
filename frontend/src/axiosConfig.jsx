// src/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

const getToken = () =>
  localStorage.getItem('fd_token') ||
  localStorage.getItem('token') ||
  sessionStorage.getItem('fd_token');

api.interceptors.request.use((config) => {
  const t = getToken();
  console.log('attach auth?', !!t, config.method?.toUpperCase(), config.url); // debug
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default api;
