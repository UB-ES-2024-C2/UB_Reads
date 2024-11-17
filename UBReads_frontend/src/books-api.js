import axios from 'axios';

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const apiURL = import.meta.env.VITE_GOOGLE_BOOKS_API_URL;

console.log(`apiKey: ${apiKey}`);
console.log(`apiURL: ${apiURL}`);

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
