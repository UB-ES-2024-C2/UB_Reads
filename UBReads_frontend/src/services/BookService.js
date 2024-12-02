import booksAPI from '../books-api';
import backendAPI from '../backend-api';


class BookService {
    getGoogleBookById(id) {
        return booksAPI.get(`/volumes/${id}`)
            .then((response) => response);
    }
      
    getGoogleBooksByQuery(query) {
        return booksAPI.get(`/volumes?q=${query}`)
            .then((response) => response)
            .catch((error) => {console.error('GET error:', error)});
    }

    getBackendBooks() {
        return backendAPI.get(`/books/`)
            .then((response) => response)
            .catch((error) => {console.error('GET error:', error)});
    }

    addBookToBackend(book) {
        return backendAPI.post(`/books/`, book)
            .then((response) => response);
    }
}

export default new BookService();