import React from 'react';
import { SearchBookCard } from '..';
import { ImageList, ImageListItem } from '@mui/material';
import BookService from '../../services/BookService.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Book } from '@mui/icons-material';

export const SearchView = ({ onBookSelect }) => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [results, setResults] = React.useState([]);

    /**
     * Fetch books from the Google Books API
     */
    const fetchBooks = async () => {
        try {
            const books = await BookService.getGoogleBooksByQuery(state.query)
            setResults(books);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Shows the book view when a book card is clicked
     * @param {Object} book 
     */
    const handleClick = (book) => {
        navigate('/home/book', { state: { book: book } });
    };

    React.useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <ImageList sx={{ width: '100%', height: '100%', padding: '1rem', margin: 0 }} cols={3} gap={20}>
        {results.map((item) => (
            <ImageListItem key={item.id}>
            <SearchBookCard
                book={ item }
                onClick={ handleClick } />
            </ImageListItem>
        ))}
        </ImageList>
    );
}