import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Stack } from '@mui/system';
import { blue, pink } from '@mui/material/colors';

import './styles/navbar.css'

const settings = ['Logout'];

export const NavBar = () => {

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
      <Container disableGutters maxWidth="xl" className='navbar-container'>
        <Stack direction="row" className="navbar-stack" sx={{ bgcolor: blue[700]}}>
                {/* LOGO */}
                <Box >
                    <Tooltip title="UB Reads">
                        <img src="UBReads_frontend/src/assets/react.svg" />
                    </Tooltip>
                </Box>
        
                {/* Avatar menu */}
                <Box>
                    <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar >U</Avatar>
                    </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                    {settings.map((setting) => (
                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography sx={{ textAlign: 'center', color: pink[500] }}>{setting}</Typography>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
        </Stack>
      </Container>
  );
}