import React from 'react';
import { Rating, Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export const BookRatingAvg = ({ averageRating = 0, userRating, maxValue = 5 }) => {

    const createRatingLabels = (max = 5) => {
        return Object.fromEntries(
            Array.from({ length: max }, (_, i) => [i + 1, (i + 1).toString()])
        );
    };

    const labels = createRatingLabels(maxValue);

    const getLabelText = (value) => `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;


    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ marginRight: '1rem', fontWeight: 'bold' }}>Average Rating:</Typography>
            <Rating
                name="average-rating"
                value={averageRating === 0 ? userRating : averageRating}
                precision={0.5}
                readOnly
                size="large"
                getLabelText={getLabelText}
                emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <Box sx={{ ml: '1rem' }}>{averageRating === 0 ? userRating : averageRating || 'N/A'}</Box>
        </Box>
    );
};

