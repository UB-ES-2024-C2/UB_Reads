import React from 'react';

import { Rating, Box } from '@mui/material';

// MUI Icons
import StarIcon from '@mui/icons-material/Star';
import { useEffect } from 'react';

export const BookRating = ({ rating, maxValue = 5 }) => {

    const createRatingLabels = (max = 5, step = 0.5) => {
        const steps = (max / step) + 1;
        return Object.fromEntries(
            Array.from({ length: steps }, (_, i) => {
                const value = i * step;
                return [value, value.toString()];
            })
        );
    };

    // Rating labels
    const labels = createRatingLabels(maxValue, 1);

    /**
     * @param {number} value 
     * @returns {string} Label for the rating
     */
    const getLabelText = (value) => {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'bottom', fontSize: '1.5rem', paddingBlock: '1rem' }}>
            <Rating readOnly
                    name="hover-feedback"
                    size="large"
                    value={rating}
                    precision={0.5}
                    getLabelText={getLabelText}
                    sx={{ display: 'flex', alignContent: 'center' }}
                    emptyIcon={<StarIcon  fontSize='inherit'/>}
                />
                {rating !== null && (
                    <Box sx={{ ml: '1rem' }}>{ rating }</Box>
                )}
        </Box>
    )
}