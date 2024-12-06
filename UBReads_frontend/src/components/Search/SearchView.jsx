import React from 'react';
import { SearchBookCard } from '..';
import { ImageList, ImageListItem } from '@mui/material';
import BookService from '../../services/BookService.js';
import { useLocation, useNavigate } from 'react-router-dom';

export const SearchView = ({ onBookSelect }) => {
    const navigate = useNavigate();

    const { state } = useLocation();
    const [results, setResults] = React.useState([]);

    React.useEffect(() => {
        BookService.getGoogleBooksByQuery(state.query).then((response) => {
            setResults(response.data.items);
        });
      }, []);

      const handleClick = (book) => {
        navigate('/home/book', { state: { book: book } });
      };

    return (
        <ImageList sx={{ width: '100%', height: '100%', padding: '1rem', margin: 0 }} cols={3} gap={20}>
        {results.map((item) => (
            <ImageListItem key={item.id}>
            <SearchBookCard bookData={ item } onClick={ handleClick } />
            </ImageListItem>
        ))}
        </ImageList>
    );
}