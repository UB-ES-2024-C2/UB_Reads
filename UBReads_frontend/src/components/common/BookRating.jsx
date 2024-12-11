import React, { useState } from 'react';
import { Rating, Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export const BookRating = ({ averageRating = 0, userRating = 0, maxValue = 5, onRatingChange }) => {
    const [userSelectedRating, setUserSelectedRating] = useState(userRating); // User's rating state.

    const createRatingLabels = (max = 5) => {
        return Object.fromEntries(
            Array.from({ length: max }, (_, i) => {
                const value = i + 1; // Integer values from 1 to `max`
                return [value, value.toString()];
            })
        );
    };

    // Rating labels
    const labels = createRatingLabels(maxValue);

    /**
     * @param {number} value
     * @returns {string} Label for the rating
     */
    const getLabelText = (value) => {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    };

    const handleRatingChange = (event, newValue) => {
        setUserSelectedRating(newValue); // Update user rating locally.
        if (onRatingChange) {
            onRatingChange(newValue); // Trigger callback for backend update.
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.5rem', paddingBlock: '1rem' }}>
            {/* Average Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: '1rem', fontWeight: 'bold' }}>Average Rating:</Typography>
                <Rating
                    name="average-rating"
                    size="large"
                    value={averageRating}
                    readOnly
                    precision={0.5}
                    getLabelText={getLabelText}
                    sx={{ display: 'flex', alignContent: 'center' }}
                    emptyIcon={<StarIcon fontSize="inherit" />}
                />
                <Box sx={{ ml: '1rem' }}>{averageRating}</Box>
            </Box>

            {/* User Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: '1rem', fontWeight: 'bold' }}>Your Rating:</Typography>
                <Rating
                    name="user-rating"
                    size="large"
                    value={userSelectedRating}
                    precision={0.5} // Only allow integer ratings.
                    onChange={handleRatingChange}
                    getLabelText={getLabelText}
                    sx={{ display: 'flex', alignContent: 'center' }}
                    emptyIcon={<StarIcon fontSize="inherit" />}
                />
                <Box sx={{ ml: '1rem' }}>{userSelectedRating}</Box>
            </Box>
        </Box>
    );
};
