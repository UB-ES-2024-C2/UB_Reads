import axios from 'axios';

const apiURL = import.meta.env.VITE_BACKEND_API_URL;

const backendAPI = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("Entorno:", import.meta.env.MODE);
console.log("URL de la API:", apiURL);

export default backendAPI;
