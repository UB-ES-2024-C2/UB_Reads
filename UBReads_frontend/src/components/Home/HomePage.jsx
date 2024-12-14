/**
 * ??-??-2024
 * @description: Home page
 * @author: @neorefraction && @subiranet
 */

// React
import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// Material UI
import { Container, width } from "@mui/system";  // Layout
import { Typography, Box } from "@mui/material";  // Components
import { blue } from "@mui/material/colors"; // Colors

// Own Components
import { Nav } from "..";
import { FollowersView } from "..";
import { BookView, SearchView, ProfileView, LibraryView } from '..';
import UserService from "../../services/UserService";
import { Sidebar } from '..';


/**
 * Home page component
 * @returns Home page with an empty div
 */
export const HomePage = () => {

    const navigate = useNavigate();

    // track location
    const location = useLocation();

    // Navbar content state
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [navButtonText, setNavButtonText] = React.useState('');
    const [navPlaceholder, setNavPlaceholder] = React.useState('');

    // Search states
    const [bookQuery, setBookQuery] = React.useState('');
    const [userQuery, setUserQuery] = React.useState('');

    const handleSearch = (query) => {
        // Avoid empty searches
        if(query === '') return;

        if (location.pathname === '/home/followed') {
            setUserQuery(query);
        } else {
            setBookQuery(query);
            navigate(`search/${query}`);
        }
    };
    
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const data = await UserService.getUserData(token);
            setUser(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchUserData();
    }, []);

    React.useEffect(() => {
        if(location.pathname === '/home/followed') {
            setNavButtonText('Afgir');
            setNavPlaceholder('Nom d\'usuari');
        } else {
            setNavButtonText('Cerca');
            setNavPlaceholder('Cerca un llibre');
        }
    }, [location.pathname]);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}>
            </Container>
        );
    }

    return (
        // Main container
        <Container maxWidth="false" sx={{ paddingInline: '0 !important', height: '100dvh', overflow: 'hidden' }}>
            {/* Navigation bar */}
            <Nav user={user} buttonText={navButtonText} placeholder={navPlaceholder} onSearch={handleSearch} />
            {/* Variable Content */}
            <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex' }}>
                <Sidebar />
                <Routes>
                    {/* Home page */}
                    <Route path="/" element={
                        <Typography variant="h2" sx={{ fontWeight: 'bold', color: blue[800], height: '100%', width: '100%', alignContent: 'center', textAlign: 'center' }}>
                        Benvingut a UBReads!
                        </Typography>
                    } />
                    {/* Main content */}
                    <Route path="book/:book_id" element={<BookView />} />
                    <Route path="search/:query" element={<SearchView query={bookQuery} />} />
                    <Route path="library" element={<LibraryView />} />
                    <Route path="profile" element={<ProfileView />} />
                    <Route path="followed" element={<FollowersView query={userQuery} />} />
                </Routes>
            </Box>
        </Container>
    )
}
