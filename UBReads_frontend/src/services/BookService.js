import booksAPI from '../books-api';

class BookService {
    getGoogleBookById(id) {
        return booksAPI.get(`/volumes/${id}`)
            .then((response) => response);
    }
}

export default new BookService();