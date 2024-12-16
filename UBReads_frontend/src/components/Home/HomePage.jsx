/**
 * ??-??-2024
 * @description: Home page
 * @author: @neorefraction && @subiranet
 */

// React
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

// Material UI
import { Container, Box } from "@mui/system";  // Layout

// Own Components
import { Nav } from "..";
import { FollowersView } from "..";
import { HomeView } from "..";     // Home view
import { BookView, SearchView, ProfileView, LibraryView } from '..';
import { Sidebar } from '..';


/**
 * Home page component
 * @returns Home page with an empty div
 */
export const HomePage = () => {

    // Hook used to navigate through routes
    const navigate = useNavigate();

    // React state used to store the query from the search bar
    const [query, setQuery] = React.useState('');

    /**
     * Handles the query from the SearchView bar
     * navigating to the SearchView page if the query is not empty
     * @param {string} query
     */
    const search = (query) => {
        if (query !== '') navigate(`search/${query}`);
    }

  return (
        // Main container
        <Container maxWidth="false" sx={{ paddingInline: '0 !important', height: '100dvh', overflow: 'hidden' }}>
            {/* Navigation bar */}
            <Nav onSearch={ search } />
            {/* Variable Content */}
            <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex' }}>
                <Sidebar />
                <Routes>
                    {/* Home page */}
                    <Route path="/" element={<HomeView />} />
                    {/* Main content */}
                    <Route path="book/:id" element={<BookView />} />
                    <Route path="search/:query" element={<SearchView onSearch={ search } />} />
                    <Route path="library" element={<LibraryView />} />
                    <Route path="profile" element={<ProfileView />} />
                    <Route path="following" element={<FollowersView />} />
                </Routes>
            </Box>
        </Container>
  )
}
