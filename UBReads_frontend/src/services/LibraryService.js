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
     * Deletes a book from a user library given the user and book ids
     * @param {number} userId 
     * @param {number} bookId 
     */
    deleteBookFromUser(userId, bookId) {
        return backendAPI.delete(`/users/${userId}/books/${bookId}`)
            .then((response) => response);
    }

    /**
     * Adds a new book rating from a user library given the book ID and the user ID
     * @param {number} userId
     * @param {number} bookId
     * @param {number} rating
     * @param {string} comment
     */
    addRating_Comment(userId, bookId, rating, comment = '') {
        const requestBody = {
            rating: rating,
            comment: comment
        };

        return backendAPI.patch(`/users/${userId}/books/${bookId}/rating`, requestBody)
            .then((response) => response);
    }

}

export default new LibraryService();