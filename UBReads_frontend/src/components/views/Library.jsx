/**
 * 27-11-2024
 * @description: Library view
 * @author: @neorefraction
 */

// React
import React, { useEffect, useState } from "react";

// MUI Icons
import CancelIcon from '@mui/icons-material/Cancel';

// MUI Components
import { IconButton, Avatar, Typography } from "@mui/material";

// MUI Colors
import { pink, blue } from '@mui/material/colors';

// MUI Layouts
import { Grid2, Container, Box } from '@mui/material';

// Components
import { BookRating } from "../";

// Services
import getUserData from '../../services/getData.js';
import LibraryService from '../../services/LibraryService.js';
import BookService from '../../services/BookService.js';

export const Library = () => {

    const [books, setBooks] = useState([]);

    const fetchUserBooks = async () => {
        const token = localStorage.getItem('access_token');

        try {
            const user = await getUserData.getUserData(token);
            const response = await LibraryService.getBooksByUser(user.id);
            const books = await Promise.all(response.data.map(async book => {
                const apiBook = await BookService.getGoogleBookById(book.book.id_book);
                return ({
                    ...book.book,
                    averageRating: apiBook.data.volumeInfo.averageRating,
                    personalRating: 0
                });
            }));
            setBooks(books);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Deletes a book from the user's library
     * @param {string} bookId 
     */
    const handleDeleteBook = async (bookId) => {
        // TODO: Llamar a la api para obtener el id del libro y eliminar el libro
        confirm('Estás segur que vols eliminar aquest llibre?')

        if (confirmed) {
            const token = localStorage.getItem('access_token');
            const user = await getUserData.getUserData(token);
            const response = await LibraryService.deleteBookFromUser(user.id, bookId);
        }
    }

    useEffect(() => {
        fetchUserBooks();
    }, []);

    return (
        /* Main container */
        <Container maxWidth="false" sx={{ paddingInline: '0 !important', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', }}>
            {/* Header */}
            <Box>
                <Grid2 container spacing={1} sx={{ borderBlock: '1px solid #505050', paddingBlock: '1rem', paddingInline: '2rem', bgcolor: blue[900], color: 'white' }}>
                    <Grid2 size={1}></Grid2>
                    <Grid2 size={4}>
                        <Typography variant="h6" color="text" sx={{ fontWeight: 'bold' }}>
                            Book
                        </Typography>
                    </Grid2>
                    <Grid2 size={3}>
                        <Typography variant="h6" color="text" sx={{ fontWeight: 'bold' }}>
                            Average Rating
                        </Typography>
                    </Grid2>
                    <Grid2 size={3}>
                        <Typography variant="h6" color="text" sx={{ fontWeight: 'bold' }}>
                            Personal Rating
                        </Typography>
                    </Grid2>
                </Grid2>
            </Box>
            {/* Books */}
            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                {books.map((book) => (
                    /* Book */
                    <Grid2 container key={book.id} spacing={1} sx={{ paddingBlock: '1rem', paddingInline: '2rem', borderBottom: '1px solid #303030', alignItems: 'center' }}>
                        <Grid2 size={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }} onClick={() => {
                                handleDeleteBook(book.id);
                            }} >
                                <IconButton edge="end" aria-label="delete" disableRipple sx={{ margin: '0' }}>
                                    <CancelIcon sx={{ color: pink[600] }} />
                                </IconButton>
                            </Box>
                        </Grid2>
                        <Grid2 size={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar variant="rounded" src={book.cover_url} />
                                <Box sx={{ marginInline: '1rem' }}>
                                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>{book.title}</Typography>
                                    <Typography variant="h6" color="text.secondary">{book.author}</Typography>
                                </Box>
                            </Box>
                        </Grid2>
                        <Grid2 size={3}>
                            <BookRating rating={book.averageRating} />
                        </Grid2>
                        <Grid2 size={3}>
                            <BookRating rating={book.personalRating} />
                        </Grid2>
                    </Grid2>
                ))}
            </Box>
        </Container>
    );
}