import backendAPI from '../backend-api';

class LibraryService {
    /**
     * Adds a book to a user library given the user and book ids
     * @param {number} userId 
     * @param {number} bookId 
     */
    addBookToUser(userId, bookId) {
        return backendAPI.post(`/users/${userId}/books/${bookId}`)
            .then((response) => response);
    }

    /**
     * Gets all the books from a user
     * @param {number} userId 
     */
    getBooksByUser(userId) {
        return backendAPI.get(`/users/${userId}/books/`)
            .then((response) => response);
    }

    /**
     * Gets a specific book from a user.
     * @param {number} userId 
     * @param {number} bookId 
     */
    getBookByUser(userId, bookId) {
        return backendAPI.get('ruta').then((response) => response);
    }
}

export default new LibraryService();