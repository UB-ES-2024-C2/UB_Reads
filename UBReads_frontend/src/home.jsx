// React import

// eslint-disable-next-line no-unused-vars
import React from "react";
import { NavBar } from "./navbar";  // Component

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

  if (!localStorage.getItem("access_token")){
    navigate("/");
  } else {
    return (
      <Container disableGutters className="home-container" maxWidth="false">
        <NavBar/>
        <Container className="content-container" maxWidth="xl">
          <Typography variant="h1">Benvingut a <b>UBReads</b></Typography>
        </Container>
      </Container>
    )
  }
}