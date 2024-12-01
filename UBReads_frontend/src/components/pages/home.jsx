// React import

// eslint-disable-next-line no-unused-vars
import React from "react";
import { NavBar } from "./navbar";
import { Book } from './components/views/Book';

import { Search } from './components/views/Search';

// Style import
import './styles/home.css';

/* Material UI imports */
// Layout
import { Container } from "@mui/system";

// Component
import { Typography } from "@mui/material";

import { blue } from "@mui/material/colors";

/**
 * 
 * @returns Home page with an empty div
 */
export const Home = () => {
  const [query, setQuery] = React.useState('');
  const [selectedBook, setSelectedBook] = React.useState(null);

  const handleQuery = (newQuery) => {
    setQuery(newQuery);
    setSelectedBook(null);
  }

  const handleBookSelect = (book) => {
    setSelectedBook(book);

  };

  const handleBackToSearch = () => {
    setSelectedBook(null);
  };

  return (
    <Container disableGutters className="home-container" maxWidth="false">
      <NavBar onSearch={ handleQuery }></NavBar>
      <div id="home-content-container">
        {selectedBook ? (
          <Book book={ selectedBook }></Book>
        ) : query !== '' ? (
          <Search query={ query } onBookSelect={ handleBookSelect }></Search>
        ) : (
          <Typography variant="h2" align="center" sx={{ fontWeight: 'bold', color: blue[800], alignSelf: 'center', justifySelf: 'center' }}>
            Benvingut a UBReads!
          </Typography>
        )}
      </div>
    </Container>
  )
}
