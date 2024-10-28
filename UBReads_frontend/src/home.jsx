// React import
import React from "react";
import { NavBar } from "./navbar";  // Component

// Style import
import './styles/home.css';

/* Material UI imports */
// Layout
import { Container } from "@mui/system";

// Component
import { Typography } from "@mui/material";

/**
 * 
 * @returns Home page with an empty div
 */
export const Home = () => {
    return (
        <Container disableGutters className="home-container" maxWidth="false">
            <NavBar />
            <Container className="content-container" maxWidth="xl">
                <Typography variant="h1" sx={{ fontWeight: "bold" }}>WELCOME TO UB READS</Typography>
            </Container>
        </Container>
    )
}