import googleAPI from '../api/google-api';
import backendAPI from '../api/backend-api';


class BookService {

    /* GOOGLE API FUNTIONS */

    /**
     * Given a book from the Google Books API, returns a book object with the necessary data
     * @param {Object} book 
     * @returns Object with the book data
     */
    createBookFromGoogleAPI(book) {
        const { volumeInfo } = book;
        return {
            id_book: book.id,
            title: volumeInfo.title,
            averageRating: volumeInfo.averageRating ? volumeInfo.averageRating : 0,
            author: volumeInfo.authors ? volumeInfo.authors[0] : 'Autor Desconegut',
            description: volumeInfo.description ? volumeInfo.description : 'Sense descripció',
            category: volumeInfo.categories ? volumeInfo.categories[0] : 'Categoria Desconeguda',
            year: volumeInfo.publishedDate ? volumeInfo.publishedDate.split('-')[0] : 0,
            cover_url: volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail ? volumeInfo.imageLinks.thumbnail : '../assets/placeholder.jpg'
        }
    }

    /**
     * Returns the books from the Google Books API given a query
     * @param {String} query 
     * @returns 
     */
    async getGoogleBooksByQuery(query) {
        // Get the books from the Google Books API
        const response = await googleAPI.get(`/volumes?q=${query}&maxResults=15`);
        // Manage response
        switch (response.status) {
            case 200:
                const books = response.data.items
                return books.map(book => this.createBookFromGoogleAPI(book));
            case 500:
                throw new Error('Error intern en el servidor');
            case 404:
                throw new Error('No s\'ha trobat cap llibre');
            case 400:
                throw new Error('Format de la query incorrecte');
            default:
                throw new Error('Error desconegut en l\'API de Google Books');
        }
    }

    /**
     * Returns the average rating of a book from Google Books API given its google ID
     * @param {string} id_book 
     */
    async getBookAverageRating(id_book) {
        // Get the book data from the Google Books API
        const response = await googleAPI.get(`/volumes/${id_book}`);
        // Manage response
        switch (response.status) {
            case 200:
                return response.data.volumeInfo.averageRating ? response.data.volumeInfo.averageRating : 0;
            case 500:
                throw new Error('Error intern en el servidor');
            case 404:
                throw new Error('No s\'ha trobat cap llibre amb aquest ID');
            case 400:
                throw new Error('Format de l\'ID incorrecte');
            default:
                throw new Error('Error desconegut en l\'API de Google Books');
        }
    }

    /* BACKEND API FUNCTIONS */

    /**
     * Returns all the books from the backend
     * @returns Array with all the books from the backend
     */
    async getAllBackendBooks() {
        // Get the book data from the backend API
        const response = await backendAPI.get(`/books/`)
        // Manage response
        switch (response.status) {
            case 200:
                return response.data;
            case 500:
                throw new Error('Error intern en el servidor');
            default:
                throw new Error('Error desconegut en l\'API del backend');
        }
    }

    /**
     * Add a book to the backend database
     * @param {Object} book 
     */
    async addBookToBackend(book) {
        // Add a book to the backend
        const response = await backendAPI.post(`/books/`, book);
        // Manage errors
        switch (response.status) {
            case 500:
                throw new Error('Error intern en el servidor');
        }
    }

    /**
     * Returns the book given a single id
     * @param {String} id
     * @returns
     */
    async getGoogleBookById(id) {
        // Get the books from the Google Books API
        const response = await googleAPI.get(`/volumes/${id}`);
        // Manage response
        switch (response.status) {
            case 200:
                return response;
            case 500:
                throw new Error('Error intern en el servidor');
            case 404:
                throw new Error('No s\'ha trobat cap llibre');
            case 400:
                throw new Error('Format de la query incorrecte');
            default:
                throw new Error('Error desconegut en l\'API de Google Books');
        }
    }
}

export default new BookService();