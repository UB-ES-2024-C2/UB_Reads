import './book.css';
import React from 'react';

import getUserData from '../../services/getData.js';
import LibraryService from '../../services/LibraryService.js';

// Material UI imports
import StarIcon from '@mui/icons-material/Star'; // Icons
import { green, blue } from '@mui/material/colors'; // Colors
import { Typography, Button, Rating, Box } from '@mui/material'; // Components

export const Book = ({ book }) => {
    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };


    const [bookAdded, setBookAdded] = React.useState(false);

    const labels = {
        0: "0",
        0.5: "0.5",
        1: "1",
        1.5: "1.5",
        2: "2",
        2.5: "2.5",
        3: "3",
        3.5: "3.5",
        4: "4",
        4.5: "4.5",
        5: "5",
    };

    const [readMorePressed, setReadMorePressed] = React.useState(false);

    const getLabelText = (value) => {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }

    const showMore = () => {
        setReadMorePressed(!readMorePressed);
    }

    const addBookToUser = () => {
        const token = localStorage.getItem("access_token");
        console.log(book);
        getUserData.getUserData(token).then((user) => {
            LibraryService.addBookToUser(user.id, book.id).then(() => {
                setBookAdded(true);
            });
        });
    }

    const removeBookFromUser = () => {
        const token = localStorage.getItem("access_token");
        getUserData.getUserData(token).then((user) => {
            LibraryService.removeBookFromUser(user.id, book.id).then(() => {
                setBookAdded(false);
            });
        });
    }

    React.useEffect(() => {
        const token = localStorage.getItem("access_token");
        getUserData.getUserData(token).then((user) => {
            LibraryService.getBooksByUser(user.id).then((books) => {
                books.data.forEach((b2) => {
                    if (b2.id === book.id) setBookAdded(true);
                });
            });
        });
    }, []);

    return (
        <div id="book-container">
            <div id="cover-container">
                <img src={ book.cover }/>
            </div>
            <div id="data-container">
                <Typography variant="h2" component="h1" sx={{ color: blue[800], fontWeight: 'bold' }}>{ book.title }</Typography>
                <Typography variant="h6" component="h2" sx={{ color: blue[800], fontSize: '1.5rem' }}>{ book.author }</Typography>
                <div id="rating-container">
                    <Rating readOnly
                        name="hover-feedback"
                        size="large"
                        value={book.averageRating}
                        precision={0.5}
                        getLabelText={getLabelText}
                        sx={{ display: 'flex', alignContent: 'center' }}
                        emptyIcon={<StarIcon  fontSize='inherit'/>}
                    />
                    {book.averageRating !== null && (
                        <Box sx={{ ml: '1rem' }}>{ book.averageRating }</Box>
                    )}
                </div>
                <label style={{ display:'block', marginBottom: '1rem' }}>
                    Llegit
                    <input disable type="checkbox" onChange={handleChange}/>
                </label>
                <Button
                    id="add-button"
                    variant="contained"
                    sx={{
                        bgcolor: green['A700'],
                        paddingInline: '3rem',
                        textTransform: 'capitalize',
                        fontSize: '1.2rem',
                        borderRadius: '0.5rem'
                    }}
                    onClick={bookAdded ? removeBookFromUser : addBookToUser}
                    >
                        {bookAdded ? 'Eliminar' : 'Afegir'}
                </Button>
                {book.desciption !== undefined && (
                    <div id="content-container">
                        <Typography variant="h5" component="p" sx={{ maxHeight: readMorePressed ? 'none' : '2lh', overflow: 'hidden' }}>{ book.desciption }</Typography>
                        <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: blue[800], cursor: 'pointer' }} onClick={showMore}>
                            {readMorePressed ? 'Veure menys' : 'Veure mÃ©s'}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}
