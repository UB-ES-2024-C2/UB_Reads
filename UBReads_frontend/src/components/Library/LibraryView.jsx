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
import { BookRating } from "../index.js";

// Services
import getUserData from '../../services/UserService.js';
import LibraryService from '../../services/LibraryService.js';
import BookService from '../../services/BookService.js';

export const LibraryView = () => {

    // Component variables
    const [library, setLibrary] = useState([]);

    const fetchUserBooks = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const books = await LibraryService.getBooksByUser(token);
            await Promise.all(books.map(async (book) => book.averageRating = await BookService.getBookAverageRating(book.id_book)));
            setLibrary(books);
        } catch (error) {
            alert(error);
        }
    }

    /**
     * Deletes a book from the user's library
     * @param {String} bookId 
     */
    const removeBook = async (book) => {
        try {
            const confirmation = confirm(`Segur que vols eliminar "${book.title}" de la biblioteca?`);
            if (!confirmation) return;
            const token = localStorage.getItem('access_token');
            await LibraryService.deleteBookFromUser(book, token);
            const new_library = library.filter(item => item.id !== book.id);
            setLibrary(new_library);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUserBooks();
    }, []);

    return (
        /* Main container */
        <Container maxWidth="false" sx={{ paddingInline: '0 !important', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '85%' }}>
            {/* Header */}
            <Box>
                <Grid2 container spacing={1} sx={{ borderBlock: '1px solid #505050', paddingBlock: '1rem', paddingInline: '2rem', bgcolor: blue[900], color: 'white' }}>
                    <Grid2 size={1}></Grid2>
                    <Grid2 size={4}>
                        <Typography variant="h6" color="text" sx={{ fontWeight: 'bold' }}>
                            Llibre
                        </Typography>
                    </Grid2>
                    <Grid2 size={3}>
                        <Typography variant="h6" color="text" sx={{ fontWeight: 'bold' }}>
                            Puntuació Mitjana
                        </Typography>
                    </Grid2>
                    <Grid2 size={3}>
                        <Typography variant="h6" color="text" sx={{ fontWeight: 'bold' }}>
                            Puntuació Personal
                        </Typography>
                    </Grid2>
                </Grid2>
            </Box>
            {/* Books */}
            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                {library.map((book) => (
                    /* Book */
                    <Grid2 container key={book.id} spacing={1} sx={{ paddingBlock: '1rem', paddingInline: '2rem', borderBottom: '1px solid #303030', alignItems: 'center' }}>
                        <Grid2 size={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }} onClick={() => {
                                removeBook(book);
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
                            <BookRating rating={0} />
                        </Grid2>
                    </Grid2>
                ))}
            </Box>
        </Container>
    );
}