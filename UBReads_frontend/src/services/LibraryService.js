// API
import backendAPI from '../api/backend-api';

// Auxiliar services
import BookService from './BookService.js';
import UserService from './UserService.js';

class LibraryService {
    /**
     * Adds a book to a user library given the book and the user's token
     * @param {Object} book 
     * @param {String} token 
     */
    async addBookToUser(book, token) {
        // Retrieves backend books to check if the book is already in the backend
        let backendBooks = await BookService.getAllBackendBooks();
        let backendBook = backendBooks.find(backendBook => backendBook.id_book === book.id_book);
        
        // If the book is not in the backend, add it
        if (!backendBook) {
            await BookService.addBookToBackend(book);
            backendBooks = await BookService.getAllBackendBooks();
            backendBook = backendBooks.find(_backendBook => _backendBook.id_book === book.id_book);
        }

        // Get the user data from the token
        const user = await UserService.getUserData(token);
        // Add a book to a user's library
        const response = await backendAPI.post(`/users/${user.id}/books/${backendBook.id}`);
        // Manage errors
        switch (response.status) {
            case 500:
                throw new Error('Error intern en el servidor');
            case 400:
                throw new Error('Format de l\'ID incorrecte');
        }
    }

    /**
     * Gets all the books saved by a user from the backend given its user id
     * @param {String} token 
     */
    async getCurrentUserBooks(token) {
        // Get the user data from the token
        const user = await UserService.getUserData(token);
        // Get the books from the backend API
        const response  = await backendAPI.get(`/users/${user.id}/books/`);
        // Manage response
        switch (response.status) {
            case 200:
                return response.data.map(item => ({
                      ...item.book,
                      is_read: item.is_read,
                    }));

            case 500:
                throw new Error('Error intern en el servidor');
            case 400:
                throw new Error('Format de l\'ID incorrecte');
            default:
                throw new Error('Error desconegut en l\'API del backend');
        }
    }

    async getLastBooksAdded(token) {
        // Get the book data from the backend API
        const library = await this.getCurrentUserBooks(token);
        return library.slice(-15);

    }

    /**
     * Deletes a book from a user library given the user and book ids
     * @param {Object} book
     * @param {String} token
     */
    async deleteBookFromUser(book, token) {
        // Retrieves backend books to catch the book backend id
        const backendBooks = await BookService.getAllBackendBooks();
        const backendBook = backendBooks.find(backendBook => backendBook.id_book === book.id_book);

        // Get the user data from the token
        const user = await UserService.getUserData(token);
        // Add a book to a user's library
        const response = await backendAPI.delete(`/users/${user.id}/books/${backendBook.id}`);
        // Manage errors
        switch (response.status) {
            case 500:
                throw new Error('Error intern en el servidor');
            case 400:
                throw new Error('Format de l\'ID incorrecte');
        }
    }

    async isBookAdded(bookGoogleId, token) {
        // Retrieves user's library to check if the book is already in the library
        const library = await this.getCurrentUserBooks(token);
        return !!library.find(backendBook => backendBook.id_book === bookGoogleId);
    }

    async getBooksByUserId(id) {
        // Get the books from the backend API
        const response  = await backendAPI.get(`/users/${id}/books/`);
        // Manage response
        switch (response.status) {
            case 200:
                return response.data.map(item => ({
                  ...item.book,
                  is_read: item.is_read,
                }));
            case 500:
                throw new Error('Error intern en el servidor');
            case 400:
                throw new Error('Format de l\'ID incorrecte');
            default:
                throw new Error('Error desconegut en l\'API del backend');
        }
    }

    /**
     * Adds a new book rating from a user library given the book ID and the user ID
     * @param {number} userId
     * @param {number} bookId
     * @param {number} rating
     */
    async addRating(userId, bookId, rating) {
        if (!rating) rating = 0;
        const requestBody = {
            rating: rating,
        };

        return await backendAPI.patch(`/users/${userId}/books/${bookId}/rating`, requestBody)
    }

    /**
     * Update the read status
     * @param {string} token
     * @param {Object} book
     * @param {boolean} read
     */
    async addRead(token, book, read) {
        const user = await UserService.getUserData(token);
        let backendBooks = await BookService.getAllBackendBooks();
        let backendBook = backendBooks.find(backendBook => backendBook.id_book === book.id_book);

        // If the book is not in the backend, add it
        if (!backendBook) {
            await BookService.addBookToBackend(book);
            backendBooks = await BookService.getAllBackendBooks();
            backendBook = backendBooks.find(_backendBook => _backendBook.id_book === book.id_book);
        }

        const requestBody = {
            is_read: read,
        };

        return backendAPI.patch(`/users/${user.id}/books/${backendBook.id}/read-status`, requestBody)
          .then((response) => response);
    }

    /**
     * Returns the rating a user has given to a book
     * @param {number} userId
     * @param {number} bookId
     */
    async getRating(userId, bookId) {
        const response = await backendAPI.get(`/users/${userId}/books/${bookId}/rating`)
        switch (response.status) {
            case 200:
                return response.data;
            case 500:
                throw new Error('Error intern en el servidor');
            case 400:
                throw new Error('Format de l\'ID incorrecte');
            default:
                throw new Error('Error desconegut en l\'API del backend');
        }
    }
}

export default new LibraryService();