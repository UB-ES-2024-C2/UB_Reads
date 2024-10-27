import React from "react";
import './styles/home.css';
import { NavBar } from "./navbar";

/**
 * 
 * @returns Home page with an empty div
 */
export const Home = () => {
    return (
        <div className="home-container">
            <NavBar />
            <p>WELCOME TO UB READS</p>
        </div>
    )
}