import axios from 'axios';

const apiURL = import.meta.env.VITE_GOOGLE_BOOKS_API_URL;
const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

const booksAPI = axios.create({
    baseURL: apiURL,
    headers: {
        'Content-type': 'application/json'
    },
    params: {
        key: apiKey
    }
});

export default booksAPI;
