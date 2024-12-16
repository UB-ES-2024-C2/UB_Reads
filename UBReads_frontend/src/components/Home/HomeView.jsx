import React from "react";
import { useNavigate } from "react-router-dom";

// Material UI
import { Box, Container, Stack } from "@mui/material"; // Layout
import { Typography, Avatar } from "@mui/material";
import { blue } from "@mui/material/colors";

export const HomeView = () => {

    const navigate = useNavigate();

    const mockBooks = [
        {
            id_book: 1,
            title: 'El Quijote',
            author: 'Miguel de Cervantes',
            averageRating: 4.5,
            description: 'El ingenioso hidalgo don Quijote de la Mancha, conocido habitualmente como Don Quijote, es una novela escrita por el español Miguel de Cervantes Saavedra. Publicada su primera parte con el título de El ingenioso hidalgo don Quijote de la Mancha a comienzos de 1605, es la obra más destacada de la literatura española y una de las principales de la literatura universal.',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 2,
            title: 'El Señor de los Anillos',
            author: 'J.R.R. Tolkien',
            averageRating: 4.7,
            description: 'El Señor de los Anillos es una novela de fantasía épica escrita por el filólogo y escritor británico J. R. R. Tolkien. Su historia se desarrolla en la Tercera Edad del Sol de la Tierra Media, un lugar ficticio poblado por hombres y otras razas antrop',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 3,
            title: 'Cien años de soledad',
            author: 'Gabriel García Márquez',
            averageRating: 4.8,
            description: 'Cien años de soledad es una novela del escritor colombiano Gabriel García Márquez, publicada en 1967. Es considerada una obra maestra de la literatura hispanoamericana y universal, así como una de las obras más traducidas y leídas en español.',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 1,
            title: 'El Quijote',
            author: 'Miguel de Cervantes',
            averageRating: 4.5,
            description: 'El ingenioso hidalgo don Quijote de la Mancha, conocido habitualmente como Don Quijote, es una novela escrita por el español Miguel de Cervantes Saavedra. Publicada su primera parte con el título de El ingenioso hidalgo don Quijote de la Mancha a comienzos de 1605, es la obra más destacada de la literatura española y una de las principales de la literatura universal.',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 2,
            title: 'El Señor de los Anillos',
            author: 'J.R.R. Tolkien',
            averageRating: 4.7,
            description: 'El Señor de los Anillos es una novela de fantasía épica escrita por el filólogo y escritor británico J. R. R. Tolkien. Su historia se desarrolla en la Tercera Edad del Sol de la Tierra Media, un lugar ficticio poblado por hombres y otras razas antrop',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 3,
            title: 'Cien años de soledad',
            author: 'Gabriel García Márquez',
            averageRating: 4.8,
            description: 'Cien años de soledad es una novela del escritor colombiano Gabriel García Márquez, publicada en 1967. Es considerada una obra maestra de la literatura hispanoamericana y universal, así como una de las obras más traducidas y leídas en español.',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 1,
            title: 'El Quijote',
            author: 'Miguel de Cervantes',
            averageRating: 4.5,
            description: 'El ingenioso hidalgo don Quijote de la Mancha, conocido habitualmente como Don Quijote, es una novela escrita por el español Miguel de Cervantes Saavedra. Publicada su primera parte con el título de El ingenioso hidalgo don Quijote de la Mancha a comienzos de 1605, es la obra más destacada de la literatura española y una de las principales de la literatura universal.',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 2,
            title: 'El Señor de los Anillos',
            author: 'J.R.R. Tolkien',
            averageRating: 4.7,
            description: 'El Señor de los Anillos es una novela de fantasía épica escrita por el filólogo y escritor británico J. R. R. Tolkien. Su historia se desarrolla en la Tercera Edad del Sol de la Tierra Media, un lugar ficticio poblado por hombres y otras razas antrop',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 3,
            title: 'Cien años de soledad',
            author: 'Gabriel García Márquez',
            averageRating: 4.8,
            description: 'Cien años de soledad es una novela del escritor colombiano Gabriel García Márquez, publicada en 1967. Es considerada una obra maestra de la literatura hispanoamericana y universal, así como una de las obras más traducidas y leídas en español.',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 1,
            title: 'El Quijote',
            author: 'Miguel de Cervantes',
            averageRating: 4.5,
            description: 'El ingenioso hidalgo don Quijote de la Mancha, conocido habitualmente como Don Quijote, es una novela escrita por el español Miguel de Cervantes Saavedra. Publicada su primera parte con el título de El ingenioso hidalgo don Quijote de la Mancha a comienzos de 1605, es la obra más destacada de la literatura española y una de las principales de la literatura universal.',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 2,
            title: 'El Señor de los Anillos',
            author: 'J.R.R. Tolkien',
            averageRating: 4.7,
            description: 'El Señor de los Anillos es una novela de fantasía épica escrita por el filólogo y escritor británico J. R. R. Tolkien. Su historia se desarrolla en la Tercera Edad del Sol de la Tierra Media, un lugar ficticio poblado por hombres y otras razas antrop',
            cover_url: 'https://picsum.photos/200'
        },
        {
            id_book: 3,
            title: 'Cien años de soledad',
            author: 'Gabriel García Márquez',
            averageRating: 4.8,
            description: 'Cien años de soledad es una novela del escritor colombiano Gabriel García Márquez, publicada en 1967. Es considerada una obra maestra de la literatura hispanoamericana y universal, así como una de las obras más traducidas y leídas en español.',
            cover_url: 'https://picsum.photos/200'
        },
    ];

    const mockUsers = [
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        },
        {
            username: 'user1',
            email: 'test@test',
            profileImage: 'https://picsum.photos/200'
        }
    ];

    return (
        // Main container
        <Container maxWidth="false" sx={{ height: '100%', p: '2rem', width: '85%' }}>
            <Box sx={{ height: '33%' }}>
                <Typography variant="h2" sx={{ color: blue[800], fontSize: '2.75rem', fontWeight: 500, height: '25%' }}>Recomanacions</Typography>
                <Stack direction="row" sx={{ overflowX: 'auto', whiteSpace: 'nowrap', height: '75%' }}>
                    {/* Recomendations */}
                    {mockBooks.map((book) => (
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
            </Box>
            <Box sx={{ height: '33%' }}>
                <Typography variant="h2" sx={{ color: blue[800], fontSize: '2.75rem', fontWeight: 500, height: '25%' }}>Books afegits recentment</Typography>
                <Stack direction="row" sx={{ overflowX: 'auto', whiteSpace: 'nowrap', height: '75%' }}>
                    {/* Added books */}
                    {mockBooks.map((book) => (
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
            </Box>
            <Box sx={{ height: '33%' }}>
                <Typography variant="h2" sx={{ color: blue[800], fontSize: '2.75rem', fontWeight: 500, height: '25%' }}>Ultims seguits</Typography>
                <Stack direction="row" sx={{ overflowX: 'auto', whiteSpace: 'nowrap', height: '75%' }}>
                    {/* Last followed users */}
                    {mockUsers.map((user) => (
                        <Box sx={{ height: '14rem', maxWidth: '14rem', minWidth: '14rem', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <Avatar src={user.profileImage} sx={{ height: '50%', width: '50%' }} />
                            <Typography sx={{ mt: '1rem', fontSize: '1.25rem', padding: 0 }}>{user.username}</Typography>
                            <Typography sx={{ fontSize: '1.25rem', padding: 0 }}>{user.email}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Container>
    );
};