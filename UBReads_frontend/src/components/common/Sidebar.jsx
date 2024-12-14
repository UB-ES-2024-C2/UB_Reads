// React
import React from 'react';

// Material UI
import { Box } from '@mui/material'; // Layout
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'; // List
import { blue } from '@mui/material/colors'; // Colors

export const Sidebar = () => {
    return (
        <Box sx={{ width: '15%', bgcolor: blue[700] }}>
            <List sx={{ width: '100%' }}>
            {['Inici', 'Biblioteca', 'Seguits'].map((text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton>
                        <ListItemText primary={text} sx={{ '& span': { fontSize: '1.75rem', color: 'white', ml: '1.5rem' } }} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
      </Box>
    );
};