import axios from 'axios';

let API_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
if (!API_URL) {
  try {
    const { protocol, hostname } = window.location;
    API_URL = `${protocol}//${hostname}:3000`;
  } catch {
    API_URL = 'http://localhost:3000';
  }
}

export const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});
