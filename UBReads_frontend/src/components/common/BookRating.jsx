import React, { useState } from 'react';
import { Rating, Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export const BookRating = ({ averageRating = 0, userRating = 0, maxValue = 5, onRatingChange }) => {
    const [userSelectedRating, setUserSelectedRating] = useState(userRating);

    useEffect(() => {
        setUserSelectedRating(userRating); // Ensure state sync when `userRating` changes externally
    }, [userRating]);

    const createRatingLabels = (max = 5) => {
        return Object.fromEntries(
            Array.from({ length: max }, (_, i) => [i + 1, (i + 1).toString()])
        );
    };

    const labels = createRatingLabels(maxValue);

    const getLabelText = (value) => `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;

    const handleRatingChange = (event, newValue) => {
        setUserSelectedRating(newValue);
        if (onRatingChange) onRatingChange(newValue);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: '1rem', fontWeight: 'bold' }}>Average Rating:</Typography>
                <Rating
                    name="average-rating"
                    value={averageRating}
                    precision={0.5}
                    readOnly
                    size="large"
                    getLabelText={getLabelText}
                    emptyIcon={<StarIcon fontSize="inherit" />}
                />
                <Box sx={{ ml: '1rem' }}>{averageRating || 'N/A'}</Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: '1rem', fontWeight: 'bold' }}>Your Rating:</Typography>
                <Rating
                    name="user-rating"
                    value={userSelectedRating}
                    precision={0.5}
                    onChange={handleRatingChange}
                    size="large"
                    getLabelText={getLabelText}
                    emptyIcon={<StarIcon fontSize="inherit" />}
                />
                <Box sx={{ ml: '1rem' }}>{userSelectedRating || 'N/A'}</Box>
            </Box>
        </Box>
    );
};

