/**
 * ??-??-2024
 * @description: Search view component
 * @author: @neorefraction
 */

// React
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Own book cards components
import { SearchBookCard } from '..';

// Material UI components
import { ImageList, ImageListItem } from '@mui/material';

// Services
import BookService from '../../services/BookService.js';
import LibraryService from '../../services/LibraryService.js';

/**
 * Search view component
 * @returns React component with the search view
 */
export const SearchView = () => {

    // Hook used to navigate through routes
    const navigate = useNavigate();

    // Get the query from the URL
    const { query } = useParams();

    // React states used to store the results and the user library
    const [results, setResults] = React.useState([]);
    const [library, setLibrary] = React.useState([]); // Used to if a book is already in the user's library

    const TOKEN = localStorage.getItem('access_token');

    /**
     * Fetch books from the Google Books API
     */
    const fetchBooks = async () => {
        try {
            const googleBooks = await BookService.getGoogleBooksByQuery(query)
            setResults(googleBooks);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLibrary = async () => {
        try {
            const libraryBooks = await LibraryService.getBooksByUser(TOKEN);
            setLibrary(libraryBooks);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Shows the book view when a book card is clicked
     * @param {Object} book 
     */
    const showBook = (book) => {
        navigate('/home/book', { state: { book: book } });
    };

    // Fetch books and library when the component is mounted
    React.useEffect(() => {
        fetchBooks();
        fetchLibrary();
    }, []);

    return (
        // Image list with the search results cards
        <ImageList sx={{ width: '85%', height: '100%', padding: '1rem', margin: 0 }} cols={3} gap={20}>
        {/* If results found show them */}
        {results.map((item) => (
            <ImageListItem>
                <SearchBookCard key={item.id_book}
                    book={ item }
                    library={ library }
                    onClick={ showBook } />
            </ImageListItem>
        ))}
        </ImageList>
    );
}