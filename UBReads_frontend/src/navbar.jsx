// React imports
import React, { useEffect, useRef } from 'react';
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
import Lupa from './assets/lupa.png'

/**
 *
 * @returns basic navigation bar with a simple user menu
 */
export const NavBar = () => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const searchInputRef = useRef();

  const handleSearch = async (e) => {
      e.preventDefault();
      const query = searchInputRef.current.value.trim();
      alert("Searching query:\n" + query)
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logOut = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const profilePage = () => {
    alert('Aixo hauria de navegar a la user page.\nNot implemented.');
  };

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
    <Container disableGutters maxWidth="false" className='navbar-container' sx={{ bgcolor: blue[800] }}>
        <Stack direction="row" className="navbar-stack">
            <Link to="/home">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Logo */}
                    <img src={Logo} alt="Logo" className="Logo"/>
                </Box>
            </Link>
            {/* Searchbox */}
            <form className="search-container" onSubmit={handleSearch}>
                <Box className="search-box">
                    <img src={Lupa} alt="Lupa" className="search-icon"/>
                    <input type="text" className="search-bar" ref={searchInputRef} />
                </Box>
                <button type="submit" className="submit-btn">Cerca</button>
            </form>

            <Box className="navbar-item">
                {/* Avatar */}
                <Tooltip title="User menu">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar src="/broken-image.jpg"/>
                        <Box className="user-data">
                            <Typography className="user-text">Username</Typography>
                            <Typography className="user-text">usermail@example.com</Typography>
                        </Box>
                    </IconButton>
                </Tooltip>
                {/* User menu */}
                <Menu
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    sx={{ mt: "0.5rem", minWidth: "13vw" }}
                >
                    <MenuItem onClick={profilePage}>
                        <Typography sx={{ textAlign: 'center', color: blue, minWidth: "13vw" }}>Perfil</Typography>
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                        <Typography sx={{ textAlign: 'center', color: pink[500], minWidth: "13vw" }}>Log Out</Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </Stack>
    </Container>
  );
};
