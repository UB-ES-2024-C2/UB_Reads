import booksAPI from '../books-api';
import http from 'axios';

class BookService {
    async getGoogleBookById(id) {
        return await booksAPI.get(`/books/v1/volumes/${id}`)
            .then((response) => {
                return response.data.volumeInfo;
            });
    }
}

export default new BookService();