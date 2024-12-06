import axios from 'axios';

const apiURL = import.meta.env.VITE_BACKEND_API_URL;

const backendAPI = axios.create({
  baseURL: apiURL,
  headers: {
    'Access-Control-Allow-Origin': 'http://ubreads-dev-public-bucket.s3-website-eu-west-1.amazonaws.com',
    'Content-Type': 'application/json',
  }
});

export default backendAPI;
