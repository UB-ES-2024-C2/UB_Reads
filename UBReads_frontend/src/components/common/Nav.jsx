// React imports
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Router Link

// Material UI imports
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';


// Colors
import { pink, blue } from "@mui/material/colors";

// Style imports
import Logo from "../../assets/logo.png";

export const Nav = ({ user, buttonText, placeholder, onSearch }) => {
    const navigate = useNavigate();

    // User menu states
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    // Searchbox states
    const [input, setInput] = React.useState('');

    // User menu functions
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Searchbox functions
    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(input.trim());
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const logOut = () => {
        if (confirm('N\'estas segur que vols sortir de l\'aplicació?')) {
            localStorage.removeItem("access_token");
            navigate("/");
        }
    };

    return (
        // Main container
        <Container disableGutters maxWidth="false" sx={{ bgcolor: blue[800], width: '100%', height: '5rem', position: 'sticky', top: 0, display: 'flex' }}>
            {/* Navigation features */}
            <Stack direction="row" sx={{ height: '100%', marginInline: '2.5rem', display: 'flex', alignItems: 'center', width: '65%', justifyContent: 'space-between' }}>
                {/* Logo */}
                <Avatar variant="square" src={Logo} alt="Logo" onClick={() => navigate('/home')} />
                {/* Searchbox */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30dvw', height: '100%' }} onKeyDown={handleKeyDown}>
                    <TextField fullWidth sx={{ color: 'white', width: '100%', '& .MuiInputBase-input': {backgroundColor: 'white', height: '100%'} }} placeholder={placeholder} onChange={(e) => setInput(e.target.value)} value={input} />
                    <Button disableRipple variant="outlined" sx={{ color: '#ffffff', borderColor: '#ffffff', backgroundColor: blue[800], marginLeft: '0.5dvw' }} onClick={handleSearch}>{buttonText}</Button>
                </Box>
            </Stack>
            {/* User menu */}
            <Box sx={{ width: '35%', mr: '2.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <Box></Box>
                <Tooltip title="User Menu" arrow onClick={handleClick}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', height: '100%', alignItems: 'center', '&:hover': { cursor: 'pointer' } }}>
                        <Avatar src={user.image} />
                        <Box sx={{ m: '1rem' }}>
                            <Typography sx={{ textAlign: 'left', color: 'white'}}>{user.username}</Typography>
                            <Typography sx={{ textAlign: 'left', color: 'white'}}>{user.email}</Typography>
                        </Box>
                    </Box>
                </Tooltip>
                {/* Menu */}
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={() => navigate('/home/profile')}>
                        <Typography sx={{ textAlign: "center", color: blue, minWidth: "13vw" }}>Perfil</Typography>
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                        <Typography sx={{ textAlign: "center", color: pink[500], minWidth: "13vw" }}>Log Out</Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </Container>
    );
};