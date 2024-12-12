import React, { useState, useEffect } from "react";
import { Container } from "@mui/system";
import { grey } from "@mui/material/colors";
import { Typography, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { UserList } from "./userList";
import { UserCard } from "./userCard"; // Import UserCard
import UserService from "../../services/UserService.js";
import FollowerService from "../../services/FollowerService.js";

export const FollowersView = () => {
    const [userFound, setUserFound] = useState(null);
    const [username, setUsername] = useState([]);
    const [followedUsers, setFollowedUsers] = useState([]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            followUser(username);
        }
    };

    const fetchUsersFollowed = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const usersFollowed = await FollowerService.getUsersFollowed(token);
            setFollowedUsers(usersFollowed);
        } catch (error) {
            console.error("Error al obtener los usuarios seguidos:", error);
        }
    };

    const followUser = async (username) => {
        try {
            const token = localStorage.getItem('access_token');
            await FollowerService.followUserByUsername(token, username);
            setFollowedUsers([...followedUsers, username]);
        } catch (error) {
            console.error("Error al seguir al usuario:", error);
        }
    };

    useEffect(() => {
        fetchUsersFollowed();
    }, []);

    return (
        <Container
            disableGutters
            className="home-container"
            maxWidth="false"
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
        <Box
            sx={{
            mt: 1,
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "2rem",
            position: "relative",
            }}
        >
            <TextField
            variant="outlined"
            placeholder="Nom d'usuari..."
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
                width: "20%",
                marginRight: "1rem",
            }}
            />
        </Box>

        <Box sx={{ mt: 4, flexShrink: 0 }}>
            <Typography
            variant="h4"
            align="center"
            sx={{
                fontWeight: "bold",
                color: grey[800],
            }}
            >
            Users You Are Following:
            </Typography>
        </Box>

        <Box
            sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            mt: 4,
            }}
        >
            <Box
            sx={{
                width: "90%",
                maxWidth: "600px",
                maxHeight: "70vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
            >
            </Box>
        </Box>
        </Container>
    );
};