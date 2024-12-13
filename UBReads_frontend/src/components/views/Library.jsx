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
import { BookRatingAvg } from "../";
import {BookRatingUser} from "../common/BookRatingUser";


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
        const books = await Promise.all(
            response.data.map(async (book) => {
                const [apiBook, userRatingResponse] = await Promise.all([
                    BookService.getGoogleBookById(book.book.id_book),
                    LibraryService.getRating(user.id, book.book.id)
                ]);
                return {
                    ...book.book,
                    averageRating: apiBook.data.volumeInfo.averageRating || 0,
                    personalRating: userRatingResponse.status === 200 ? userRatingResponse.data.rating : 0,
                    ourId: book.book.id,
                };
            })
        );
        setBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
};

    const handlePersonalRatingChange = async (bookId, newRating) => {
        const token = localStorage.getItem('access_token');
        try {
            const user = await getUserData.getUserData(token);
            const response = await LibraryService.addRating(user.id, bookId, newRating);
            if (response.status === 200) {
                setBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.id === bookId ? { ...book, personalRating: newRating } : book
                    )
                );
            }
        } catch (error) {
            console.error("Error updating personal rating:", error);
        }
    };

    const handleDeleteBook = async (bookId) => {
        const confirmed = window.confirm("Estàs segur que vols eliminar aquest llibre?");
        if (confirmed) {
            const token = localStorage.getItem('access_token');
            try {
                const user = await getUserData.getUserData(token);
                const response = await LibraryService.deleteBookFromUser(user.id, bookId);
                if (response.status === 200) {
                    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
                }
            } catch (error) {
                console.error("Error deleting book:", error);
            }
        }
    };



    useEffect(() => {
        fetchUserBooks();
    }, []);

    return (
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
                    <Grid2 container key={book.id} spacing={1} sx={{ padding: '1rem 2rem', borderBottom: '1px solid #303030', alignItems: 'center' }}>
                        <Grid2 xs={1}>
                            <IconButton onClick={() => handleDeleteBook(book.id)} disableRipple>
                                <CancelIcon sx={{ color: pink[600] }} />
                            </IconButton>
                        </Grid2>
                        <Grid2 size={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar variant="rounded" src={book.cover_url} />
                                <Box sx={{ marginInline: '1.5rem' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{book.title}</Typography>
                                    <Typography>{book.author}</Typography>
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
                ))}
            </Box>
        </Container>
    );
};
