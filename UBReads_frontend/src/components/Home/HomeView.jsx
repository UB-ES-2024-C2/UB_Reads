import React from "react";
import { useNavigate } from "react-router-dom";

// Material UI
import { Box, Container, Stack } from "@mui/material"; // Layout
import { Typography, Avatar } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

// Services
import BookService from "../../services/BookService.js";
import LibraryService from "../../services/LibraryService.js";
import FollowerService from "../../services/FollowerService.js";

export const HomeView = () => {

    const navigate = useNavigate();

    const TOKEN = localStorage.getItem('access_token');

    const [recomendations, setRecomendations] = React.useState([]);
    const [lastBooksAdded, setLastBooksAdded] = React.useState([]);
    const [lastFollowedUsers, setLastFollowedUsers] = React.useState([]);

    const fetchRecomendations = async () => {
        try {
            const recomendations = await BookService.getGoogleRecomendations();
            setRecomendations(recomendations);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLastBooksAdded = async () => {
        try {
            const lastBooksAdded = await LibraryService.getLastBooksAdded(TOKEN);
            setLastBooksAdded(lastBooksAdded);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLastFollowedUsers = async () => {
        try {
            const lastBooksAdded = await FollowerService.getLastFollowedUsers(TOKEN);
            setLastFollowedUsers(lastBooksAdded);
        } catch (error) {

        }
    };

    React.useEffect(() => {
        fetchRecomendations();
        fetchLastBooksAdded();
        fetchLastFollowedUsers();
    }, []);

    return (
        // Main container
        <Container maxWidth="false" sx={{ height: '100%', p: '2rem', width: '85%' }}>
            <Box sx={{ height: '33%' }}>
                <Typography variant="h2" sx={{ color: blue[800], fontSize: '2.75rem', fontWeight: 500, height: '20%' }}>Recomanacions</Typography>
                <Stack direction="row" sx={{ overflowX: 'auto', whiteSpace: 'nowrap', height: '80%' }}>
                    {/* Recomendations */}
                    {recomendations.map((book) => (
                        <Box key={book.id} sx={{ height: '14rem', textAlign: 'center', maxWidth: '14rem', minWidth: '14rem', padding: '1rem' }}>
                            <img src={book.cover_url} alt={book.title} style={{ borderRadius: '1rem', width: 'auto', height: '75%', objectFit: 'cover', border: `1px solid ${grey[300]}` }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '25%' }}>
                                <Typography
                                    variant="h6"
                                    onClick={() => navigate(`/home/book/${book.id_book}`, { state: { book: book } })}
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
            </Box>
            <Box sx={{ height: '33%' }}>
                <Typography variant="h2" sx={{ color: blue[800], fontSize: '2.75rem', fontWeight: 500, height: '25%' }}>Books afegits recentment</Typography>
                <Stack direction="row" sx={{ overflowX: 'auto', whiteSpace: 'nowrap', height: '75%' }}>
                    {/* Added books */}
                    {lastBooksAdded.length === 0 ? (
                            <Typography variant="h6" sx={{ color: grey[500], fontSize: '1.5rem', fontWeight: 500, height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>Cap llibre afegit a la biblioteca</Typography>
                        ) : (
                        lastBooksAdded.map((book) => (
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
                        )
                    ))}
                </Stack>
            </Box>
            <Box sx={{ height: '33%' }}>
                <Typography variant="h2" sx={{ color: blue[800], fontSize: '2.75rem', fontWeight: 500, height: '25%' }}>Ultims seguits</Typography>
                <Stack direction="row" sx={{ overflowX: 'auto', whiteSpace: 'nowrap', height: '75%' }}>
                    {/* Last followed users */}
                    {lastFollowedUsers.length === 0 ? (
                            <Typography variant="h6" sx={{ color: grey[500], fontSize: '1.5rem', fontWeight: 500, height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>Cap usuari afegit</Typography>
                        ) : (
                        lastFollowedUsers.map((user) => (
                            <Box sx={{ height: '14rem', maxWidth: '14rem', minWidth: '14rem', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <Avatar src={user.profile_pic} sx={{ height: '50%', width: '50%' }} />
                                <Typography sx={{ mt: '1rem', fontSize: '1.25rem', padding: 0 }}>{user.username}</Typography>
                                <Typography sx={{ fontSize: '1.25rem', padding: 0 }}>{user.email}</Typography>
                            </Box>
                        )
                    ))}
                </Stack>
            </Box>
        </Container>
    );
};