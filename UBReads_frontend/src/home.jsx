import React from "react";
import './styles/home.css';
import { NavBar } from "./navbar";
import { Container, flexbox } from "@mui/system";
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