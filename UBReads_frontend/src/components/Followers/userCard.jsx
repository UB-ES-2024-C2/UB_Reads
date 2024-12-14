import React from "react";

// Material UI
import { Box } from "@mui/material"; // Layout
import { Avatar, Typography } from "@mui/material"; // Components


export const UserCard = () => {
    return (
        <Box sx={{ display: 'flex', padding: '1rem', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100%', width: '100%' }}>
            <Avatar sx={{ height: '50%', width: '80%' }}>U</Avatar>
            <Typography sx={{ mt: '1rem', fontSize: '1.25rem', padding: 0 }}>User name</Typography>
        </Box>
    );
};
