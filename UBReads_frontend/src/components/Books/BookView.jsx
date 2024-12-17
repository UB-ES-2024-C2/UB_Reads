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

    // React Hook used to navigate through pages
    const navigate = useNavigate();

    // Book data retrieved from parent component
    const { state } = useLocation();
    const book = state.book;

    // Component states used to manage the book added status and the read more button
    const [bookAdded, setBookAdded] = React.useState(false);
    const [readMorePressed, setReadMorePressed] = React.useState(false);

    // Component states used to manage the user rating
    const [userRating, setUserRating] = useState(null);
    const [isRead, setIsRead] = useState(false);

    const TOKEN = localStorage.getItem('access_token');

    /**
     * Adds a book to the user library
     */
    const addBook = async () => {
        try {
            await LibraryService.addBookToUser(book, TOKEN);
            await LibraryService.addRead(token, book, confirm('Has llegit aquest llibre?'));
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
            await LibraryService.deleteBookFromUser(book, TOKEN);
            setBookAdded(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRatingChange = async (newRating) => {
        const library = await LibraryService.getCurrentUserBooks(TOKEN);

        const backendBook = library.find((libraryBook) => libraryBook.id_book === book.id_book);

        if (backendBook) {
            const user = await UserService.getUserData(TOKEN);
            const response = await LibraryService.addRating(user.id, backendBook.id, newRating);

            if (response.status === 200) {
                setUserRating(newRating);
            } else {
                console.warn('Error updating rating:', response);
            }
        } else {
            throw new Error('No pots valorar un llibre que no tens a la biblioteca');
        }
    };

    const handleCheckboxChange = async (event) => {
        setIsRead(event.target.checked);
        const token = localStorage.getItem('access_token');
        await LibraryService.addRead(token, book, event.target.checked);
    };


    /**
     * Checks if a book is already added to the user library
     */
    const isBookAdded = async () => {
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
        isBookAdded();
    }, []);

    return (
        /* Main container */
        <Container maxWidth="false" sx={{
            width: '85%',
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                    <BookRatingAvg averageRating={book.averageRating} userRating={userRating}/>
                    <BookRatingUser userRating={userRating} onRatingChange={handleRatingChange} />
                </Box>

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