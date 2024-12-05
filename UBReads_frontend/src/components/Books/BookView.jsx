/**
 * ??-??-2024
 * @description: Book view
 * @author: @neorefraction
 */

// React
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Services
import getUserData from '../../services/getData.js';

// MUI Layouts
import { Container, Box } from '@mui/material';

// MUI Icons
import ClearIcon from '@mui/icons-material/Clear';

// MUI Colors
import { green, blue, pink } from '@mui/material/colors';

// MUI Components
import { Typography, Button, IconButton } from '@mui/material';

// Own Components
import { BookRating } from '../index.js';

import LibraryService from '../../services/LibraryService.js';
import BookService from '../../services/BookService.js';

/**
 * @returns Book view
 */
export const Book = () => {

    // React Hook used to navigate through pages
    const navigate = useNavigate();

    // Book data retrieved from parent component
    const { state } = useLocation();
    const book = state.book;

    // Component states
    const [bookAdded, setBookAdded] = React.useState(false);
    const [readMorePressed, setReadMorePressed] = React.useState(false);

    const handleAddBook = async () => {

        const book2 = {
            id_book: book.id,
            title: book.title,
            author: book.author,
            category: book.category,
            year: book.year != 'Unknown' ? Number(book.year) : 0,
            cover_url: book.cover_url
        }

        console.log(book.year);

        const token = localStorage.getItem('access_token');
        let bookId = null;
        
        // Check if the book is on backend database
        const bookExists = await BookService.getBackendBooks();
        bookExists.data.forEach(backendBook => {
            if (backendBook.id_book === book.id) {
                bookId = backendBook.id;
            }
        });

        if (bookId !== null) {
            const user = await getUserData.getUserData(token);
            const response = await LibraryService.addBookToUser(user.id, bookId);
            if (response.status === 200) {
                setBookAdded(true);
            }
        } else {
            await BookService.addBookToBackend(book2);
            const books = await BookService.getBackendBooks();
            books.data.forEach(backendBook => {
                console.log(backendBook);
                console.log(book)
                if (backendBook.id_book === book.id) {
                    console.log(backendBook);
                    bookId = backendBook.id;
                }
            });

            const user = await getUserData.getUserData(token);
            const response = await LibraryService.addBookToUser(user.id, bookId);
            if (response.status === 200) {
                setBookAdded(true);
            }
        }
    }

    const handleRemoveBook = async () => {
        let bookId = null;
        const token = localStorage.getItem('access_token');
        const books = await BookService.getBackendBooks();
        console.log(books);
        books.data.forEach(backendBook => {
            if (backendBook.id_book === book.id) {
                bookId = backendBook.id;
            }
        });
        const user = await getUserData.getUserData(token);
        const response = await LibraryService.deleteBookFromUser(user.id, bookId);
        if (response.status === 200) {
            setBookAdded(false);
        }
    }

    const checkBookAdded = async () => {
        const token = localStorage.getItem('access_token');
        const user = await getUserData.getUserData(token);
        const response = await LibraryService.getBooksByUser(user.id);
        response.data.forEach(_book => {
            if (_book.book.id_book === book.id) {
                setBookAdded(true);
            }
        });
    }

    useEffect(() => {
        checkBookAdded();
    }, [bookAdded]);

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
                        id="add-button"
                        variant="contained"
                        onClick={() => bookAdded ? handleRemoveBook() : handleAddBook()}
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
                    {book.desciption !== undefined && (
                        <div id="content-container">
                            <Typography variant="h5" component="p" sx={{ maxHeight: readMorePressed ? 'none' : '2lh', overflow: 'hidden' }}>{ book.desciption }</Typography>
                            <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: blue[800], cursor: 'pointer' }} onClick={() =>setReadMorePressed(!readMorePressed)}>
                                {readMorePressed ? 'Veure menys' : 'Veure més'}
                            </Typography>
                        </div>
                    )}
                </Box>
            </Box>
            <Box>
                <IconButton disableRipple sx={{ width: 'wrap-content', height: 'wrap-content' }} onClick={() => navigate('/home')}>
                    <ClearIcon sx={{ color: pink[700], width: '3.5rem', height: '3.5rem' }} />
                </IconButton>
            </Box>
        </Container>
    );
}