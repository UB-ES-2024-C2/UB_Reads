import './bookcard.css';
import React from 'react';

// Material UI components
import { Rating } from '@mui/material';
import { Typography } from '@mui/material';
import { Card, CardMedia, CardContent, CardActionArea } from '@mui/material';

// Material UI icons
import StarIcon from '@mui/icons-material/Star'; // Icons

import { blue } from '@mui/material/colors';

export const BookCard = ({ bookData, onClick }) => {

    const book = {
        title: bookData.volumeInfo.title,
        author: bookData.volumeInfo.authors ? bookData.volumeInfo.authors[0] : 'Unknown',
        cover: (bookData.volumeInfo.imageLinks && bookData.volumeInfo.imageLinks.thumbnail) ? bookData.volumeInfo.imageLinks.thumbnail : '/book_placeholder.jpg',
        averageRating: bookData.volumeInfo.averageRating ? bookData.volumeInfo.averageRating : 0,
        desciption: bookData.volumeInfo.description ? bookData.volumeInfo.description : 'Sense descripció'
    }

    return (
      <Card sx={{ maxWidth: '35vw', height: '35vh', borderRadius: '1.5rem', boxShadow: 'rgba(0, 0, 0, 0.7) 0 0 1.5rem' }}>
        <CardActionArea sx={{ display: 'flex', width: '100%', height: '100%' }} disableRipple onClick={() => onClick(book)}>
            <CardMedia
                component="img"
                image={book.cover}
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
          </CardContent>
        </CardActionArea>
      </Card>
    );
};
