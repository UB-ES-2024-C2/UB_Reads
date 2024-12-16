// React
import React, { useState } from 'react';

// Material UI
import { Typography, Button } from '@mui/material';  // Components
import { Card, CardMedia, CardContent } from '@mui/material';  // Cards
import { Box } from '@mui/material';  // Layout
import { blue, pink, green } from '@mui/material/colors';  // Colors

// Own components
import { BookRatingAvg } from "../common/BookRatingAvg";

// Services
import LibraryService from '../../services/LibraryService.js';

/**
 * Book card component for the search view
 * @param {Object} book book data
 * @param {Function} onClick handles the click event over the card
 * @param {Array} library user's book saved in the library
 * @returns 
 */
export const SearchBookCard = ({ book, onClick, library }) => {

    // React states used to store the book added status
    const [bookAdded, setBookAdded] = useState(false);

    const TOKEN = localStorage.getItem('access_token');

    /**
     * Adds a book to the user library
     */
    const addBook = async () => {
        try {
            await LibraryService.addBookToUser(book, TOKEN);
            await LibraryService.addRead(TOKEN, book, confirm('Has llegit aquest llibre?'))
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
    }

    /**
     * Checks if a book is already added into the user library
     */
    const isBookAdded = () => {
        try {
            const isAdded = !!library.find(_book => _book.id_book === book.id_book);
            setBookAdded(isAdded);
        } catch (error) {
            console.error(error);
        }
    }

    // Checks if the book is on the user library when the component is mounted
    React.useEffect(() => {
        isBookAdded();
    }, []);

    return (
        // Book card
        <Card sx={{ maxWidth: '35vw', height: '35vh', borderRadius: '1.5rem', boxShadow: 'rgba(0, 0, 0, 0.7) 0 0 1.5rem' }} onClick={() => onClick(book)}>
            {/* Card Image */}
            <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
                <CardMedia
                    component="img"
                    image={book.cover_url}
                    alt="example"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        flex: 1.5
                    }}
                />
                {/* Card Content */}
                <CardContent sx={{ width: '100%', height: '100%', flex: 2 }}>
                    {/* Book title */}
                    <Typography gutterBottom variant="h3" component="p" sx={{ fontWeight: 'bold', color: blue[800], maxHeight: '2lh', overflow: 'hidden' }}>
                        {book.title}
                    </Typography>
                    {/* Book author */}
                    <Typography variant="h5" component="p" sx={{ color: blue[800] }}>
                        {book.author}
                    </Typography>
                    {/* Book rating */}
                    <BookRatingAvg averageRating={book.averageRating} />
                    {/* Add/Remove button */}
                    <Button
                        size="large"
                        variant="contained"
                        sx={{ mt: 2, bgcolor: bookAdded ? pink[700] : green['A700'], }}
                        onClick={
                            (e) =>{
                                e.stopPropagation();
                                bookAdded ? removeBook() : addBook()
                            }
                        }>
                        {bookAdded ? 'Eliminar' : 'Afegir'}
                    </Button>
            </CardContent>
            </Box>
        </Card>
    );
};
