/**
 * 27-11-2024
 * @description: Library view
 * @author: @neorefraction && @subiranet
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
import { BookRatingAvg } from "../";
import { BookRatingUser } from "../common/BookRatingUser";


// Services
import LibraryService from '../../services/LibraryService.js';
import BookService from '../../services/BookService.js';
import UserService from "../../services/UserService";

export const LibraryView = () => {

    // Component variables
    const [library, setLibrary] = useState([]);
    const TOKEN = localStorage.getItem('access_token');

     const fetchUserBooks = async () => {
        try {
            const user = await UserService.getUserData(TOKEN);
            const token = localStorage.getItem('access_token');
            const books = await LibraryService.getCurrentUserBooks(token);
            await Promise.all(books.map(async (book) => book.averageRating = await BookService.getBookAverageRating(book.id_book)));
            await Promise.all(books.map(async (book) => {
                const data = await LibraryService.getRating(user.id, book.id)
                book.personalRating = data.rating;
            }));
            setLibrary(books);
        } catch (error) {
            alert(error);
        }
    };

    const handlePersonalRatingChange = async (bookId, newRating) => {
        try {
            const user = await UserService.getUserData(TOKEN);
            const response = await LibraryService.addRating(user.id, bookId, newRating);
            if (response.status === 200) {
                setLibrary((prevBooks) =>
                    prevBooks.map((book) =>
                        book.id === bookId ? { ...book, personalRating: newRating } : book
                    )
                );
            }
        } catch (error) {
            console.error("Error updating personal rating:", error);
        }
    };

    const removeBook = async (book) => {
        try {
            const confirmation = confirm(`Are you sure you want to delete ${book.title} from your library?`);
            if (!confirmation) return;
            await LibraryService.deleteBookFromUser(book, TOKEN);
            const new_library = library.filter(item => item.id !== book.id);
            setLibrary(new_library);
        } catch (error) {
                console.error("Error deleting book:", error);
        }
    };

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
                {library.length === 0 ? (
                    <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '2rem'  }}>Cap llibre afegit a la biblioteca</Typography>
                    ) : (
                        library.map((book) => (
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
                                            <Typography variant="h6" color="text.secondary" sx={{
                                                fontWeight: 'bold',
                                                marginBottom: 0,
                                                marginTop: '1rem',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'normal',
                                                }}>{book.title}</Typography>
                                            <Typography variant="h6" color="text.secondary" sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'normal',
                                            }}>{book.author}</Typography>
                                        </Box>
                                    </Box>
                                </Grid2>
                                <Grid2 size={3}>
                                    <BookRatingAvg averageRating={book.averageRating} />
                                </Grid2>
                                <Grid2 size={3}>
                                    <BookRatingUser
                                        userRating={book.personalRating}
                                        onRatingChange={(newRating) => handlePersonalRatingChange(book.id, newRating)}
                                    />
                                </Grid2>
                            </Grid2>
                        )
                ))}
            </Box>
        </Container>
    );
};
