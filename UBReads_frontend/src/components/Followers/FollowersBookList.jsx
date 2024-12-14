import React from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Box, Typography } from "@mui/material"; // Layout
import { blue } from "@mui/material/colors"; // Colors

export const FollowersBookList = ({ books }) => {

    const navigate = useNavigate();

    React.useEffect(() => {
    }, []);

    if(!books || books.length === 0) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>Cap llibre afegit</Typography>
            </Box>
        );
    }

    return (
        <Stack direction="row" sx={{ padding: '1.5rem', overflowX: 'auto', whiteSpace: 'nowrap', height: '18rem' }}>
            {books.map((book) => (
                <Box key={book.id} sx={{ height: '14rem', textAlign: 'center', maxWidth: '14rem', minWidth: '14rem', padding: '1rem' }}>
                    <img src={book.cover_url} alt={book.title} style={{ borderRadius: '1rem', width: 'auto', height: '65%', objectFit: 'cover' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '35%' }}>
                        <Typography
                            variant="h6"
                            onClick={() => navigate(`/home/book/${book.id}`, { state: { book: book } })}
                            sx={{
                                marginBottom: 0,
                                marginTop: '1rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                                '&:hover': { cursor: 'pointer', color: blue[800]} 
                            }}>
                                {book.title}
                            </Typography>
                    </Box>
                </Box>
            ))}
        </Stack>
    );
};
