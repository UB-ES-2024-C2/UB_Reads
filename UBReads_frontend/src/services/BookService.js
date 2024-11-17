import booksAPI from '../books-api';

class BookService {
    getGoogleBooksByQuery(query) {
        return booksAPI.get(`/volumes?q=${query}`)
            .then((response) => response)
            .catch((error) => {console.error('GET error:', error)});
    }
}

export default new BookService();