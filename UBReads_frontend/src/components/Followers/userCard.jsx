import React from "react";

// Material UI
import { Box } from "@mui/material"; // Layout
import { Avatar, Typography, IconButton } from "@mui/material"; // Components
import { pink } from "@mui/material/colors"; // Colors
import CancelIcon from '@mui/icons-material/Cancel';


export const UserCard = ({ user, unfollow }) => {
    return (
        <Box sx={{ display: 'flex', padding: '1rem', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100%', width: '100%' }}>
            <Avatar src={user.profImage} sx={{ height: '50%', width: '80%' }} />
            <Typography sx={{ mt: '1rem', fontSize: '1.25rem', padding: 0 }}>{user.username}</Typography>
            <Typography sx={{ fontSize: '1.25rem', padding: 0 }}>{user.email}</Typography>
            <IconButton disableRipple sx={{ width: 'wrap-content', height: 'wrap-content' }} onClick={() => unfollow(user.username)}>
                <CancelIcon sx={{ color: pink[700], width: '1.5rem', height: '1.5rem' }} />
            </IconButton>
        </Box>
    );
};
