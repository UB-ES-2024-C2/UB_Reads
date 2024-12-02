import axios from 'axios';

const apiURL = import.meta.env.VITE_BACKEND_API_URL;

const backendAPI = axios.create({
  baseURL: apiURL,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Content-Type': 'application/json',
  }
});

export default backendAPI;
