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

// Colors
import { pink, blue } from "@mui/material/colors";

// Style imports
import "./styles/navbar.css";
import Logo from "./assets/logo.png";
import Lupa from "./assets/lupa.png";

// Javascript calls
import utils from "./utils/getData.js";

/*const fetchCurrentUser = async () => {
  try {
    const response = await fetch("http://localhost:8000/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const user = await response.json();
    console.log(user);
  } catch (error) {
    console.error(error);
  }
};*/

//fetchCurrentUser();

export const NavBar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userData, setUserData] = useState({
    usernameSTR: "Username",
    emailSTR: "username@example.com",
    profImage: "",
  });
  const searchInputRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      const data = await utils.getUserData(token);
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInputRef.current.value.trim());
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
    navigate("/userProfile");
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
      sx={{ bgcolor: blue[800] }}
    >
      <Stack direction="row" className="navbar-stack">
        <Link to="/home">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Logo */}
            <img src={Logo} alt="Logo" className="Logo" />
          </Box>
        </Link>
        {/* Searchbox */}
        <form className="search-container" onSubmit={handleSearch}>
          <Box className="search-box">
            <img src={Lupa} alt="Lupa" className="search-icon" />
            <input type="text" className="search-bar" ref={searchInputRef} />
          </Box>
          <button type="submit" className="submit-btn" onClick={handleSearch}>
            Cerca
          </button>
        </form>

        <Box className="navbar-item">
          {/* Avatar */}
          <Tooltip title="User menu">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar src={userData.profImage} />
              <Box className="user-data">
                <Typography className="user-text">
                  {userData.usernameSTR}
                </Typography>
                <Typography className="user-text">
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
              <Typography
                sx={{ textAlign: "center", color: blue, minWidth: "13vw" }}
              >
                Perfil
              </Typography>
            </MenuItem>
            <MenuItem onClick={logOut}>
              <Typography
                sx={{ textAlign: "center", color: pink[500], minWidth: "13vw" }}
              >
                Log Out
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Stack>
    </Container>
  );
};
