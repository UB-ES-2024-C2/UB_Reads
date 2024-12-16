// React
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import { Box } from '@mui/material'; // Layout
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'; // List
import { blue } from '@mui/material/colors'; // Colors

export const Sidebar = () => {

    const navigate = useNavigate();

    const handleClick = (text) => {
        switch (text) {
            case 'Inici':
                navigate('/home');
                break;
            case 'Biblioteca':
                navigate('library');
                break;
            case 'Seguits':
                navigate('followed');
                break;
        }
    };

    return (
        <Box sx={{ width: '15%', bgcolor: blue[700] }}>
            <List sx={{ width: '100%' }}>
            {['Inici', 'Biblioteca', 'Seguits'].map((text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton>
                        <ListItemText primary={text} sx={{ '& span': { fontSize: '1.75rem', color: 'white', ml: '1.5rem' } }} onClick={() => handleClick(text)} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
      </Box>
    );
};