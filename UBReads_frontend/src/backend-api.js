import axios from 'axios';

const apiURL = import.meta.env.VITE_BACKEND_API_URL;

const backendAPI = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-type': 'application/json'
  }
})

export default backendAPI;
