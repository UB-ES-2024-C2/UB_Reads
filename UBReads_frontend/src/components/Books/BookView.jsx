import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Services
import UserService from "../../services/UserService";
import LibraryService from '../../services/LibraryService.js';
import BookService from '../../services/BookService.js';

// MUI Layouts
import { Container, Box } from '@mui/material';

// MUI Icons
import ClearIcon from '@mui/icons-material/Clear';

// MUI Colors
import { green, blue, pink } from '@mui/material/colors';

// MUI Components
import { Typography, Button, IconButton, Checkbox, FormControlLabel } from '@mui/material';

// Own Components
import { BookRatingAvg } from '../';
import { BookRatingUser } from '../common/BookRatingUser';

/**
 * @returns Book view
 */
export const BookView = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const book = state.book;

    const [bookAdded, setBookAdded] = useState(false);
    const [readMorePressed, setReadMorePressed] = useState(false);
    const [userRating, setUserRating] = useState(null);
    const [isRead, setIsRead] = useState(false);

    const handleAddBook = async () => {
        try {
            const token = localStorage.getItem('access_token');
            await LibraryService.addBookToUser(book, token);
            await LibraryService.addRead(token, book, confirm('Has llegit aquest llibre?'));
            setBookAdded(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveBook = async () => {
        try {
            const token = localStorage.getItem('access_token');
            await LibraryService.deleteBookFromUser(book, token);
            setBookAdded(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRatingChange = async (newRating) => {
        const token = localStorage.getItem('access_token');
        const books = await BookService.getAllBackendBooks();

        const bookId = books.find((backendBook) => backendBook.id_book === book.id_book)?.id;

        if (bookId) {
            const user = await UserService.getUserData(token);
            const response = await LibraryService.addRating(user.id, bookId, newRating);

            if (response.status === 200) {
                setUserRating(newRating);
            } else {
                console.warn('Error updating rating:', response);
            }
        }
    };

    const handleCheckboxChange = async (event) => {
        setIsRead(event.target.checked);
        const token = localStorage.getItem('access_token');
        await LibraryService.addRead(token, book, event.target.checked);
    };

    const checkBookAdded = async () => {
        const token = localStorage.getItem('access_token');
        const response = await LibraryService.getBooksByUser(token);
        const user = await UserService.getUserData(token);

        for (const _book of response) {
            if (_book.id_book === book.id_book) {
                setBookAdded(true);
                setIsRead(_book.is_read);

                const rate = await LibraryService.getRating(user.id, _book.id);
                setUserRating(rate.rating);
            }
        }
    };

    useEffect(() => {
        checkBookAdded();
    }, []);

    return (
        <Container
            maxWidth="false"
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                paddingInline: '5rem !important',
                paddingBlock: '5rem !important',
                overflow: 'hidden',
            }}
        >
            {/* Cover container */}
            <Box sx={{ width: '25vw', height: '100%', paddingInline: '1rem' }}>
                <img
                    src={book.cover_url}
                    alt={book.title}
                    style={{ border: '1px solid', width: '100%', height: 'auto' }}
                />
            </Box>
            {/* Data container */}
            <Box sx={{ width: '75vw', height: '100%', paddingInline: '1rem' }}>
                {/* Title and author */}
                <Box>
                    <Typography variant="h2" component="h1" sx={{ color: blue[800], fontWeight: 'bold' }}>
                        {book.title}
                    </Typography>
                    <Typography variant="h6" component="h2" sx={{ color: blue[800], fontSize: '1.5rem' }}>
                        {book.author}
                    </Typography>
                </Box>
                {/* Rating */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                    <BookRatingAvg averageRating={book.averageRating} userRating={userRating}/>
                    <BookRatingUser userRating={userRating} onRatingChange={handleRatingChange} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Button
                        id="add-button"
                        variant="contained"
                        onClick={(e) => {
                            e.stopPropagation();
                            bookAdded ? handleRemoveBook() : handleAddBook();
                        }}
                        sx={{
                            bgcolor: bookAdded ? pink[700] : green['A700'],
                            paddingInline: '3rem',
                            textTransform: 'capitalize',
                            fontSize: '1.2rem',
                            borderRadius: '0.5rem',
                        }}
                    >
                        {bookAdded ? 'Eliminar' : 'Afegir'}
                    </Button>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isRead}
                                onChange={handleCheckboxChange}
                                color="primary"
                            />
                        }
                        label="Llegit"
                    />
                </Box>
                {/* Description */}
                <Box sx={{ overflow: 'auto', marginTop: '2rem' }}>
                    {book.description && (
                        <div id="content-container">
                            <Typography
                                variant="h5"
                                component="p"
                                sx={{ maxHeight: readMorePressed ? 'none' : '2lh', overflow: 'hidden' }}
                            >
                                {book.description}
                            </Typography>
                            <Typography
                                variant="h5"
                                component="span"
                                sx={{ fontWeight: 'bold', color: blue[800], cursor: 'pointer' }}
                                onClick={() => setReadMorePressed(!readMorePressed)}
                            >
                                {readMorePressed ? 'Veure menys' : 'Veure més'}
                            </Typography>
                        </div>
                    )}
                </Box>
            </Box>
            <Box>
                <IconButton
                    disableRipple
                    sx={{ width: 'wrap-content', height: 'wrap-content' }}
                    onClick={() => navigate('/home')}
                >
                    <ClearIcon sx={{ color: pink[700], width: '3.5rem', height: '3.5rem' }} />
                </IconButton>
            </Box>
        </Container>
    );
};
