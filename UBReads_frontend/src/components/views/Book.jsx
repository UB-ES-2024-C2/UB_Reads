/**
 * ??-??-2024
 * @description: Book view
 * @author: @neorefraction
 */

// React
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Services
import getUserData from '../../services/getData.js';

// MUI Layouts
import { Container, Box } from '@mui/material';

// MUI Icons
import ClearIcon from '@mui/icons-material/Clear';

// MUI Colors
import { green, blue, pink } from '@mui/material/colors';

// MUI Components
import { Typography, Button, IconButton } from '@mui/material';

// Own Components
import { BookRating } from '../';

/**
 * @returns Book view
 */
export const Book = () => {

    // React Hook used to navigate through pages
    const navigate = useNavigate();

    // Book data retrieved from parent component
    const { state } = useLocation();
    const book = state.book;

    // Component states
    const [bookAdded, setBookAdded] = React.useState(false);
    const [readMorePressed, setReadMorePressed] = React.useState(false);

    return (
        /* Main container */
        <Container maxWidth="false" sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            paddingInline: '5rem !important',
            paddingBlock: '5rem !important',
            overflow: 'hidden'
        }}>
            {/* Cover container */}
            <Box sx={{ width: '25vw', height: '100%', paddingInline: '1rem' }}>
                <img src={book.cover} alt={book.title} style={{ border: '1px solid', width: '100%', height: 'auto' }} />
            </Box>
            {/* Data container */}
            <Box sx={{ width: '75vw', height: '100%', paddingInline: '1rem' }}>
                {/* Title and author */}
                <Box>
                    <Typography variant="h2" component="h1" sx={{ color: blue[800], fontWeight: 'bold' }}>{ book.title }</Typography>
                    <Typography variant="h6" component="h2" sx={{ color: blue[800], fontSize: '1.5rem' }}>{ book.author }</Typography>
                </Box>
                {/* Rating */}
                <BookRating rating={book.averageRating} />
                <Box>
                    <Button
                        id="add-button"
                        variant="contained"
                        sx={{
                            bgcolor: bookAdded ? pink[700] : green['A700'],
                            paddingInline: '3rem',
                            textTransform: 'capitalize',
                            fontSize: '1.2rem',
                            borderRadius: '0.5rem'
                        }}
                        >
                            {bookAdded ? 'Eliminar' : 'Afegir'}
                    </Button>
                </Box>
                {/* Description */}
                <Box sx={{ overflow: 'auto', marginTop: '2rem' }}>
                    {book.desciption !== undefined && (
                        <div id="content-container">
                            <Typography variant="h5" component="p" sx={{ maxHeight: readMorePressed ? 'none' : '2lh', overflow: 'hidden' }}>{ book.desciption }</Typography>
                            <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: blue[800], cursor: 'pointer' }} onClick={() =>setReadMorePressed(!readMorePressed)}>
                                {readMorePressed ? 'Veure menys' : 'Veure més'}
                            </Typography>
                        </div>
                    )}
                </Box>
            </Box>
            <Box>
                <IconButton disableRipple sx={{ width: 'wrap-content', height: 'wrap-content' }} onClick={() => navigate('/home')}>
                    <ClearIcon sx={{ color: pink[700], width: '3.5rem', height: '3.5rem' }} />
                </IconButton>
            </Box>
        </Container>
    );
}