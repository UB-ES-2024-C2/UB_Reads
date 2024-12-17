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
import {IconButton, Avatar, Typography, Button} from "@mui/material";

// MUI Colors
import { pink, blue } from '@mui/material/colors';

// MUI Layouts
import { Grid2, Container, Box } from '@mui/material';

// Components
import { BookRatingAvg } from "../";
import {BookRatingUser} from "../common/BookRatingUser";


// Services
import LibraryService from '../../services/LibraryService.js';
import BookService from '../../services/BookService.js';
import UserService from "../../services/UserService";

export const LibraryView = () => {
    const [allBooks, setAllBooks] = useState([]);
    const [readBooks, setReadBooks] = useState([]);
    const [showOnlyRead, setShowOnlyRead] = useState(false);

    const fetchUserBooks = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const user = await UserService.getUserData(token);
            const response = await LibraryService.getBooksByUser(token);
            const books = await Promise.all(
              response.map(async (book) => {
                  const [apiBook, userRatingResponse] = await Promise.all([
                      BookService.getGoogleBookById(book.id_book),
                      LibraryService.getRating(user.id, book.id),
                  ]);
                  return {
                      ...book,
                      averageRating: apiBook.data.volumeInfo.averageRating || 0,
                      personalRating: userRatingResponse ? userRatingResponse.rating : 0,
                      ourId: book.id,
                      is_read: book.is_read,
                  };
              })
            );

            const readBooks = books.filter(book => book.is_read);

            setAllBooks(books);
            setReadBooks(readBooks); // Save the read books
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const toggleShowOnlyRead = () => {
        setShowOnlyRead((prevState) => !prevState);
    };

    function getBookList() {
        return showOnlyRead ? readBooks : allBooks
    }


    const handlePersonalRatingChange = async (bookId, newRating) => {
        const token = localStorage.getItem('access_token');
        try {
            const user = await UserService.getUserData(token);
            const response = await LibraryService.addRating(user.id, bookId, newRating);
            if (response.status === 200) {
                setAllBooks((prevBooks) => {
                    const updatedBooks = prevBooks.map((book) =>
                        book.ourId === bookId ? { ...book, personalRating: newRating } : book
                    );
                    syncReadBooks(updatedBooks); // Sync readBooks with the updated list
                    return updatedBooks;
                });
            }
        } catch (error) {
            console.error("Error updating personal rating:", error);
        }
    };

    const handleDeleteBook = async (book) => {
        const confirmed = window.confirm("Estàs segur que vols eliminar aquest llibre?");
        if (confirmed) {
            const token = localStorage.getItem('access_token');
            try {
                await LibraryService.deleteBookFromUser(book, token);
                setAllBooks((prevBooks) => {
                    const updatedBooks = prevBooks.filter((b) => b.ourId !== book.ourId);
                    syncReadBooks(updatedBooks); // Sync readBooks with the updated list
                    return updatedBooks;
                });
            } catch (error) {
                console.error("Error deleting book:", error);
            }
        }
    };

    const syncReadBooks = (updatedBooks) => {
        setReadBooks(updatedBooks.filter((book) => book.is_read));
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
                            Llibre
                        </Typography>
                    </Grid2>
                    <Grid2 size={3}>
                        <Typography variant="h6" color="text" sx={{ fontWeight: 'bold' }}>
                            Puntuació Mitjana
                        </Typography>
                    </Grid2>
                    <Grid2 size={2}>
                        <Typography variant="h6" color="text" sx={{ fontWeight: 'bold' }}>
                            Puntuació Personal
                        </Typography>
                    </Grid2>
                    <Grid2 size={1}>
                        <Button
                            onClick={toggleShowOnlyRead}
                            variant="contained"
                            sx={{
                                bgcolor: showOnlyRead ? pink[600] : blue[700],
                                color: "white",
                                fontWeight: "bold",
                                textTransform: "none",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                '&:hover': {
                                    bgcolor: showOnlyRead ? pink[800] : blue[900],
                                },
                                borderRadius: "0.5rem",
                                padding: "0.5rem 1rem",
                            }}
                        >
                            {showOnlyRead ? "Mostra tots" : "Només llegits"}
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>
            {/* Books */}
            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                {getBookList().map((book) => (
                    <Grid2 container key={book.ourId} spacing={1} sx={{ padding: '1rem 2rem', borderBottom: '1px solid #303030', alignItems: 'center' }}>
                        <Grid2 xs={1}>
                            <IconButton onClick={() => handleDeleteBook(book)} disableRipple>
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
                            <BookRatingAvg averageRating={book.averageRating} userRating={book.personalRating}/>
                        </Grid2>
                        <Grid2 size={3}>
                            <BookRatingUser
                                userRating={book.personalRating}
                                onRatingChange={(newRating) => handlePersonalRatingChange(book.ourId, newRating)}
                            />
                        </Grid2>
                    </Grid2>
                ))}
            </Box>
        </Container>
    );
};
