/**
 * ??-??-2024
 * @description: Book view
 * @author: @neorefraction
 */

// React
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Services
import LibraryService from '../../services/LibraryService.js';

// Material UI
import { Container, Box } from '@mui/material';  // Layout
import ClearIcon from '@mui/icons-material/Clear';  // Icon
import { green, blue, pink } from '@mui/material/colors';  // Colors
import { Typography, Button, IconButton } from '@mui/material';  // Components

// Own Components
import { BookRating } from '../index.js';

/**
 * Book view component
 * @returns Book view component
 */
export const BookView = () => {

    // React Hook used to navigate through pages
    const navigate = useNavigate();

    // Book data retrieved from parent component
    const { state } = useLocation();
    const book = state.book;

    // Component states used to manage the book added status and the read more button
    const [bookAdded, setBookAdded] = React.useState(false);
    const [readMorePressed, setReadMorePressed] = React.useState(false);

    /**
     * Adds a book to the user library
     */
    const addBook = async () => {
        try {
            const token = localStorage.getItem('access_token');
            await LibraryService.addBookToUser(book, token);
            setBookAdded(true);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Removes a book from the user library
     */
    const removeBook = async () => {
        try {
            const token = localStorage.getItem('access_token');
            await LibraryService.deleteBookFromUser(book, token);
            setBookAdded(false);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Checks if a book is already added to the user library
     */
    const isBookAdded = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const isAdded = await LibraryService.isBookAdded(book.id_book, token);
            setBookAdded(isAdded);
        } catch (error) {
            console.error(error);
        }
    }

    // Check if a book is already added to the user library when the component is mounted
    React.useEffect(() => {
        isBookAdded();
    }, []);

    return (
        /* Main container */
        <Container maxWidth="false" sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            paddingInline: '5rem !important',
            paddingBlock: '5rem !important',
            overflow: 'hidden'
        }}>
            {/* Cover container */}
            <Box sx={{ width: '25vw', height: '100%', paddingInline: '1rem' }}>
                <img src={book.cover_url} alt={book.title} style={{ border: '1px solid', width: '100%', height: 'auto' }} />
            </Box>
            {/* Data container */}
            <Box sx={{ width: '75vw', height: '100%', paddingInline: '1rem' }}>
                {/* Title and author */}
                <Box>
                    <Typography variant="h2" component="h1" sx={{ color: blue[800], fontWeight: 'bold' }}>{ book.title }</Typography>
                    <Typography variant="h6" component="h2" sx={{ color: blue[800], fontSize: '1.5rem' }}>{ book.author }</Typography>
                </Box>
                {/* Rating */}
                <BookRating rating={book.averageRating} />
                <Box>
                    <Button
                        variant="contained"
                        onClick={() => bookAdded ? removeBook() : addBook()}
                        sx={{
                            bgcolor: bookAdded ? pink[700] : green['A700'],
                            paddingInline: '3rem',
                            textTransform: 'capitalize',
                            fontSize: '1.2rem',
                            borderRadius: '0.5rem'
                        }}
                        >
                            {bookAdded ? 'Eliminar' : 'Afegir'}
                    </Button>
                </Box>
                {/* Description */}
                <Box sx={{ overflow: 'auto', marginTop: '2rem' }}>
                    {book.description !== undefined && (
                        <div id="content-container">
                            <Typography variant="h5" component="p" sx={{ maxHeight: readMorePressed ? 'none' : '2lh', overflow: 'hidden' }}>{ book.description }</Typography>
                            <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: blue[800], cursor: 'pointer' }} onClick={() =>setReadMorePressed(!readMorePressed)}>
                                {readMorePressed ? 'Veure menys' : 'Veure més'}
                            </Typography>
                        </div>
                    )}
                </Box>
            </Box>
            {/* Close view button */}
            <Box>
                <IconButton disableRipple sx={{ width: 'wrap-content', height: 'wrap-content' }} onClick={() => navigate(-1, { state: state })}>
                    <ClearIcon sx={{ color: pink[700], width: '3.5rem', height: '3.5rem' }} />
                </IconButton>
            </Box>
        </Container>
    );
}