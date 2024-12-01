import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL;

const backendAPI = axios.create({
  googleAPIbaseURL: apiURL,
  headers: {
    'Content-type': 'application/json'
  }
})

export default backendAPI;
