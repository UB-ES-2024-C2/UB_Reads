// React import

// eslint-disable-next-line no-unused-vars
import React from "react";
import { NavBar } from "./navbar";  // Component

import { Search } from './components/views/Search';

// Style import
import './styles/home.css';

/* Material UI imports */
// Layout
import { Container } from "@mui/system";

// Component
import { Typography } from "@mui/material";
import {useNavigate} from "react-router-dom";

/**
 * 
 * @returns Home page with an empty div
 */
export const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');

  const handleQuery = (newQuery) => {
    setQuery(newQuery);
  }

  /*if (!localStorage.getItem("access_token")){
    navigate("/");
  } else {*/
    return (
      <Container disableGutters className="home-container" maxWidth="false">
        <NavBar onSearch={ handleQuery }></NavBar>
        <Search query={ query }></Search>
      </Container>
    )
  //}
}