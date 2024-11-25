import backendAPI from '../backend-api';

class BookService {
    getGoogleBookById(id) {
        return booksAPI.get(`/volumes/${id}`)
            .then((response) => response);
    }
      
    getSavedBooks(token) {
        return backendAPI.get(`/books/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    /**
     * Returns all the books saved by a user from a given userId
     * @param {number} userId 
     * @returns {book: Object} Array of objects containing book data and read status
     */
    getBooksByUserId(userId) {
        return backendAPI.get(`/books/${userId}`)
            .then((response) => response);
    }
}

export default new BookService();