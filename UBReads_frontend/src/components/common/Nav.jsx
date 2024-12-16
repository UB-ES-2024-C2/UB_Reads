// React imports
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
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
import SearchIcon from '@mui/icons-material/Search';

// Javascript calls

import UserService from "../../services/UserService.js";

export const Nav = ({ onSearch }) => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userData, setUserData] = useState({
    usernameSTR: "Username",
    emailSTR: "username@example.com",
    profImage: "",
  });

  const [input, setInput] = useState("");

  const fetchUserData = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const data = await UserService.getUserData(token);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logOut = () => {
    if (confirm('N\'estas segur que vols sortir de l\'aplicació?')) {
      localStorage.removeItem("access_token");
      navigate("/");
    }
  };

  const profilePage = () => {
    navigate("profile");
  };

  const followingList = () => {
    navigate("/home/following");
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
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
    <Container
      disableGutters
      maxWidth="false"
      className="navbar-container"
      sx={{ bgcolor: blue[800], width: '100%', height: '5rem', position: 'sticky', top: 0 }}
    >

      
      <Stack direction="row" spacing={30} sx={{ height: '100%', marginInline: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Link to="/home">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Logo */}
            <Avatar sx={{ height: 'auto' }} variant="square" src={Logo} alt="Logo" />
          </Box>
        </Link>

        {/* Navigation Options */}
        <Box>
          <Stack direction="row" spacing={2}>
            <Button variant="text" sx={{ color: 'white' }} disableRipple onClick={() => navigate('/home')}>Inici</Button>
            <Button variant="text" sx={{ color: 'white' }} disableRipple onClick={() => navigate('/home/library')}>Biblioteca</Button>
          </Stack>
        </Box>

        {/* Searchbox */}
        <Box sx={{ minHeight: '4.5dvh', minWidth: '30vw' }} onKeyDown={handleKeyDown}>
          <Stack direction="row" spacing={2}>
            <Box sx={{ display: 'flex', padding: 0, borderRadius: '5px', minWidth: '25vw', alignItems: 'center' }}>
                <SearchIcon sx={{ 
                  color: 'white',
                  marginLeft: '0.5dvw',
                  fontSize: '3rem',
                }}/>
                <TextField fullWidth 
                  onChange={(event) => {
                    setInput(event.target.value);
                  }}
                sx={{ marginLeft: '0.5dvw',
                color: 'white',
                height: '100%',
                width: '100%',
                justifyContent:'center',
                alignContent: 'center',
                '& .MuiInputBase-input': {
                    backgroundColor: 'white',
                    height: '3.5rem',
                  }
                }} />
            </Box>
            <Button variant="outlined" sx={{ color: '#ffffff', borderColor: '#ffffff', backgroundColor: blue[800], marginLeft: '0.5dvw' }} onClick={handleSearch}>
              Cerca
            </Button>
          </Stack>
        </Box>

        <Box sx={{ minWidth: '5dvw'}}>
          {/* Avatar */}
          <Tooltip title="User menu">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} disableRipple>
              <Avatar src={userData.profImage} />
              <Box sx={{ paddingInline: '1dvw'}}>
                <Typography sx={{ textAlign: 'left', color: 'white'}}>
                  {userData.usernameSTR}
                </Typography>
                <Typography sx={{ textAlign: 'left', color: 'white'}}>
                  {userData.emailSTR}
                </Typography>
              </Box>
            </IconButton>
          </Tooltip>
          {/* User menu */}
          <Menu
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            sx={{ mt: "0.5rem", minWidth: "13vw" }}
          >
            <MenuItem onClick={profilePage}>
              <Typography sx={{ textAlign: "center", color: blue, minWidth: "13vw" }}>
                Perfil
              </Typography>
            </MenuItem>

            <MenuItem onClick={followingList}>
              <Typography sx={{ textAlign: "center", color: blue, minWidth: "13vw" }}>
                Seguint
              </Typography>
            </MenuItem>

            <MenuItem onClick={logOut}>
              <Typography sx={{ textAlign: "center", color: pink[500], minWidth: "13vw" }}>
                Tanca la sessió
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Stack>
    </Container>
  );
};