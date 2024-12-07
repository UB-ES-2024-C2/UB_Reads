import React, { useState, useEffect } from 'react';

// Material UI components
import { BookRating } from '../Common/BookRating';
import { Typography } from '@mui/material';
import { Card, CardMedia, CardContent, Box, Button } from '@mui/material';

import BookService from '../../services/BookService.js';
import LibraryService from '../../services/LibraryService.js';
import UserService from '../../services/UserService.js';

// Material UI icons
import StarIcon from '@mui/icons-material/Star'; // Icons

import { blue, pink, green } from '@mui/material/colors';

export const SearchBookCard = ({ book, onClick }) => {

    const [bookAdded, setBookAdded] = useState(false);

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

    useEffect(() => {
        isBookAdded();
    }, []);

    return (
      <Card sx={{ maxWidth: '35vw', height: '35vh', borderRadius: '1.5rem', boxShadow: 'rgba(0, 0, 0, 0.7) 0 0 1.5rem' }}>
        <Box sx={{ display: 'flex', width: '100%', height: '100%' }} onClick={() => onClick(book)}>
            <CardMedia
                component="img"
                image={book.cover_uri}
                alt="example"
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    flex: 1.5
                }}
            />
            <CardContent sx={{ width: '100%', height: '100%', flex: 2 }}>
                <Typography gutterBottom variant="h3" component="p" sx={{ fontWeight: 'bold', color: blue[800], maxHeight: '2lh', overflow: 'hidden' }}>
                    {book.title}
                </Typography>
                <Typography variant="h5" component="p" sx={{ color: blue[800] }}>
                    {book.author}
                </Typography>
                <BookRating rating={book.averageRating} />
                <Button variant="contained" sx={{ mt: 2, bgcolor: bookAdded ? pink[700] : green['A700'], }} size="large" onClick={
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
