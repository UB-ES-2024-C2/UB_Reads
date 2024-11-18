import React from 'react';
import { BookCard } from '../cards/BookCard';
import { ImageList, ImageListItem } from '@mui/material';
import BookService from '../../services/BookService.js';

export const Search = ({ query, onBookSelect }) => {

    const [results, setResults] = React.useState([]);

    React.useEffect(() => {
        if (query) {
            BookService.getGoogleBooksByQuery(query).then((response) => {
                setResults(response.data.items);
            });
        }
      }, [query]); // Se ejecuta cada vez que query cambia

      const handleClick = (book) => {
        onBookSelect(book);
      };

    return (
        <ImageList sx={{ width: '100%', height: '100%', padding: '1rem', margin: 0 }} cols={3} gap={20}>
        {results.map((item) => (
            <ImageListItem key={item.id}>
            <BookCard bookData={ item } onClick={ handleClick } />
            </ImageListItem>
        ))}
        </ImageList>
    );
}