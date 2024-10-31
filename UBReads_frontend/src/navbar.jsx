// React imports
import React, { useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom"; // Router Link

/* Material UI imports */

// Layout
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// Components
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// Colors
import { pink, blue } from '@mui/material/colors';

// Style imports
import './styles/navbar.css';
import Logo from './assets/logo.png';

/**
 * 
 * @returns basic navigation bar with a simple user menu
 */
export const NavBar = () => {
  
  const navigate = useNavigate(); // Hook para redirigir

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
      setAnchorElUser(null);
  };

  /**
   * Simple Log Out method implementation
   */
  const logOut = () => {
    navigate("/")
  }

  const profilePage = () => {
      alert('Aixo hauria de navegar a la user page.\nNot implemented.')
  }

  useEffect(() => {
      const handleClickOutside = (event) => {
          if (anchorElUser && !anchorElUser.contains(event.target)) {
              handleCloseUserMenu();
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [anchorElUser]);

  return (
    <Container disableGutters maxWidth="xl" className='navbar-container' sx={{ bgcolor: blue[800] }}>
        <Stack direction="row" className="navbar-stack">
            <Link to="/home">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Logo */}
                    <img src={ Logo } alt="Logo" />
                </Box>
            </Link>
            <Box className="search-container">
                <input type="text" className="search-bar" placeholder="Search..." />
            </Box>
            <Box className="navbar-item">
                {/* Avatar */}
                <Tooltip title="User menu">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar src="/broken-image.jpg"/>
                    </IconButton>
                </Tooltip>
                {/* User menu */}
                <Menu
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                    keepMounted transformOrigin={{ vertical: 'top', horizontal: 'center', }}
                    open={Boolean(anchorElUser)}
                    onClose={null}
                    sx={{ mt: "0.5rem" }} >

                    <MenuItem onClick={profilePage}>
                        <Typography sx={{ textAlign: 'center', color: blue }}>Perfil</Typography>
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                        <Typography sx={{ textAlign: 'center', color: pink[500] }}>Log Out</Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </Stack>
    </Container>
  );
}