import React, { useState, useEffect } from "react";
import { Container } from "@mui/system";
import { grey } from "@mui/material/colors";
import { Typography, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import FollowerService from "../../services/FollowerService.js";
import { UserCard } from "./UserCard.jsx";
import { FollowersBookList } from "./FollowersBookList.jsx";
import { Grid2 } from '@mui/material';

export const FollowersView = () => {
    const [username, setUsername] = useState([]);
    const [followedUsers, setFollowedUsers] = useState([]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            followUser(username);
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

    const [users, setUsers] = React.useState([]);

    const fetchUsersFollowed = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const usersFollowed = await FollowerService.getUsersFollowed(token);
            setUsers(usersFollowed);
        } catch (error) {
            alert(error);
        }
    }

    React.useEffect(() => {
        fetchUsersFollowed();
    }, []);

    return (
        /* Main container */
        <Container maxWidth="false" sx={{ paddingInline: '0 !important', height: '100dvh', overflow: 'auto', display: 'flex', flexDirection: 'column', paddingBottom: '5rem' }}>
            {users.map((element) => (
                <Grid2 container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid2 size={1} sx={{ border: '1px solid #000000', height: '100%' }}>
                        <UserCard />
                    </Grid2>
                    <Grid2 size={11} sx={{ border: '1px solid #000000', height: '100%' }}>
                        <FollowersBookList />
                    </Grid2>
                </Grid2>
            ))}
        </Container>
    );
};