import './bookcard.css';
import React, { useState, useEffect } from 'react';

// Material UI components
import { Rating } from '@mui/material';
import { Typography } from '@mui/material';
import { Card, CardMedia, CardContent, Box, Button } from '@mui/material';

import BookService from '../../services/BookService.js';
import LibraryService from '../../services/LibraryService.js';
import getUserData from '../../services/getData.js';

// Material UI icons
import StarIcon from '@mui/icons-material/Star'; // Icons

import { blue, pink, green } from '@mui/material/colors';

export const BookCard = ({ bookData, onClick }) => {

    const [bookAdded, setBookAdded] = useState(false);

    const book = {
        id: bookData.id,
        title: bookData.volumeInfo.title,
        author: bookData.volumeInfo.authors ? bookData.volumeInfo.authors[0] : 'Unknown',
        category: bookData.volumeInfo.categories ? bookData.volumeInfo.categories[0] : 'Unknown',
        cover_url: (bookData.volumeInfo.imageLinks && bookData.volumeInfo.imageLinks.thumbnail) ? bookData.volumeInfo.imageLinks.thumbnail : '/book_placeholder.jpg',
        year: bookData.volumeInfo.publishedDate ? bookData.volumeInfo.publishedDate.split('-')[0] : 'Unknown',
        averageRating: bookData.volumeInfo.averageRating ? bookData.volumeInfo.averageRating : 0,
        desciption: bookData.volumeInfo.description ? bookData.volumeInfo.description : 'Sense descripció'
    }

    const handleAddBook = async () => {

        const book2 = {
            id_book: book.id,
            title: book.title,
            author: book.author,
            category: book.category,
            year: Number(book.year),
            cover_url: book.cover_url
        }

        const token = localStorage.getItem('access_token');
        let bookId = null;
        
        // Check if the book is on backend database
        const bookExists = await BookService.getBackendBooks();
        bookExists.data.forEach(backendBook => {
            if (backendBook.id_book === book.id) {
                bookId = backendBook.id;
            }
        });

        if (bookId !== null) {
            const user = await getUserData.getUserData(token);
            const response = await LibraryService.addBookToUser(user.id, bookId);
            if (response.status === 200) {
                setBookAdded(true);
            }
        } else {
            await BookService.addBookToBackend(book2);
            const books = await BookService.getBackendBooks();
            books.data.forEach(backendBook => {
                if (backendBook.id_book === book.id) {
                    bookId = backendBook.id;
                }
            });

            const user = await getUserData.getUserData(token);
            const response = await LibraryService.addBookToUser(user.id, bookId);
            if (response.status === 200) {
                setBookAdded(true);
            }
        }
    }

    const handleRemoveBook = async () => {
        let bookId = null;
        const token = localStorage.getItem('access_token');
        const books = await BookService.getBackendBooks();
        books.data.forEach(backendBook => {
            if (backendBook.id_book === book.id) {
                bookId = backendBook.id;
            }
        });
        const user = await getUserData.getUserData(token);
        const response = await LibraryService.deleteBookFromUser(user.id, bookId);
        if (response.status === 200) {
            setBookAdded(false);
        }
    }

    const checkBookAdded = async () => {
        const token = localStorage.getItem('access_token');
        const user = await getUserData.getUserData(token);
        const response = await LibraryService.getBooksByUser(user.id);
        response.data.forEach(_book => {
            if (_book.book.id_book === book.id) {
                setBookAdded(true);
            }
        });
    }

    useEffect(() => {
        checkBookAdded();
    }, []);

    return (
      <Card sx={{ maxWidth: '35vw', height: '35vh', borderRadius: '1.5rem', boxShadow: 'rgba(0, 0, 0, 0.7) 0 0 1.5rem' }}>
        <Box sx={{ display: 'flex', width: '100%', height: '100%' }} onClick={() => onClick(book)}>
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
            <CardContent sx={{ width: '100%', height: '100%', flex: 2 }}>
                <Typography gutterBottom variant="h3" component="p" sx={{ fontWeight: 'bold', color: blue[800], maxHeight: '2lh', overflow: 'hidden' }}>
                    {book.title}
                </Typography>
                <Typography variant="h5" component="p" sx={{ color: blue[800] }}>
                    {book.author}
                </Typography>
                <div id="rating-container">
                    <Rating readOnly
                        name="hover-feedback"
                        size="large"
                        value={book.averageRating}
                        precision={0.5}
                        sx={{ display: 'flex', alignContent: 'center' }}
                        emptyIcon={<StarIcon  fontSize='inherit'/>}
                    />
                </div>
                <Button variant="contained" sx={{ mt: 2, bgcolor: bookAdded ? pink[700] : green['A700'], }} size="large" onClick={
                    (e) =>{
                        e.stopPropagation();
                        bookAdded ? handleRemoveBook() : handleAddBook()
                    }
                    }>
                    {bookAdded ? 'Eliminar' : 'Afegir'}
                </Button>
          </CardContent>
        </Box>
      </Card>
    );
};
