/**
 * ??-??-2024
 * @description: Home page
 * @author: @neorefraction && @subiranet
 */

// React
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

// Style import
import './styles/home.css';

// MUI Layout
import { Container } from "@mui/system";

// MUI Components
import { Typography, Box } from "@mui/material";

// MUI Colors
import { blue } from "@mui/material/colors";

// Own Components
import { Navbar } from "../";
import { Book, Search, Profile } from '../';

/**
 * @returns Home page with an empty div
 */
export const Home = () => {

  // React Hook used to navigate through pages
  const navigate = useNavigate();

  /**
   * Handles the query from the search bar
   * navigating to the search page if the query is not empty
   * @param {string} query 
   */
  const handleQuery = (query) => {
    if (query !== '') {
      navigate('search', { state: { query: query } });
    }
  }

  return (
    // Main container
    <Container maxWidth="false" sx={{ paddingInline: '0 !important', height: '100vh', overflow: 'hidden' }}>
      {/* Navigation bar */}
      <Navbar onSearch={ handleQuery }></Navbar>
      {/* Variable Content */}
      <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Routes>
          <Route path="/" element={
            <Typography variant="h2" align="center" sx={{ fontWeight: 'bold', color: blue[800], height: '100%', width: '100%' }}>
              Benvingut a UBReads!
            </Typography>
          } />
          <Route path="/book" element={<Book />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Box>
    </Container>
  )
}
