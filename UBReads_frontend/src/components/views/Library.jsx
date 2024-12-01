/**
 * 27-11-2024
 * @description: Library view
 * @author: @neorefraction
 */

// React
import React, { useEffect } from "react";

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

export const Library = () => {

    const [books, setBooks] = React.useState([
        { id: 1, title: "El Quijote", author: "Cervantes", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 4 },
        { id: 2, title: "Cien años de soledad", author: "García Márquez", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 3 },
        { id: 3, title: "El Quijote", author: "Cervantes", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 4 },
        { id: 4, title: "Cien años de soledad", author: "García Márquez", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 3 },
        { id: 5, title: "El Quijote", author: "Cervantes", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 4 },
        { id: 6, title: "Cien años de soledad", author: "García Márquez", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 3 },
        { id: 7, title: "El Quijote", author: "Cervantes", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 4 },
        { id: 8, title: "Cien años de soledad", author: "García Márquez", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 3 },
        { id: 9, title: "El Quijote", author: "Cervantes", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 4 },
        { id: 10, title: "Cien años de soledad", author: "García Márquez", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 3 },
        { id: 11, title: "El Quijote", author: "Cervantes", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 4 },
        { id: 12, title: "Cien años de soledad", author: "García Márquez", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 3 },
        { id: 13, title: "El Quijote", author: "Cervantes", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 4 },
        { id: 14, title: "Cien años de soledad", author: "García Márquez", cover: "https://picsum.photos/200", averageRating: 4.5, personalRating: 3 }
    ]);

    /**
     * Deletes a book from the user's library
     * @param {string} bookId 
     */
    const handleDeleteBook = (bookId) => {
        // TODO: Llamar a la api para obtener el id del libro y eliminar el libro
        console.log(bookId)
        confirm('Estás segur que vols eliminar aquest llibre?')
    }

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
                                <Avatar variant="rounded" src={book.cover} />
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