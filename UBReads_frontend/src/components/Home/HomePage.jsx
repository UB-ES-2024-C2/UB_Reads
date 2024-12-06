/**
 * ??-??-2024
 * @description: Home page
 * @author: @neorefraction && @subiranet
 */

// React
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

// MUI Layout
import { Container } from "@mui/system";

// MUI Components
import { Typography, Box } from "@mui/material";

// MUI Colors
import { blue } from "@mui/material/colors";

// Own Components
import { Nav } from "..";
import { BookView, SearchView, ProfileView, LibraryView } from '..';

import { FollowersView } from "..";

/**
 * @returns Home page with an empty div
 */
export const HomePage = () => {

  // React Hook used to navigate through pages
  const navigate = useNavigate();

  /**
   * Handles the query from the SearchView bar
   * navigating to the SearchView page if the query is not empty
   * @param {string} query
   */
  const handleQuery = (query) => {
    if (query !== '') {
      navigate('search', { state: { query: query } });
    }
  }

  return (
    // Main container
    <Container maxWidth="false" sx={{ paddingInline: '0 !important', height: '100dvh', overflow: 'hidden' }}>
      {/* Navigation bar */}
      <Nav onSearch={ handleQuery } />
      {/* Variable Content */}
      <Box sx={{ height: '100%', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: blue[800], height: '100%', width: '100%', alignContent: 'center', textAlign: 'center' }}>
              Benvingut a UBReads!
            </Typography>
          } />
          <Route path="book" element={<BookView />} />
          <Route path="search" element={<SearchView />} />
          <Route path="library" element={<LibraryView />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="following" element={<FollowersView />} />
        </Routes>
      </Box>
    </Container>
  )
}
