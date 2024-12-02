import React, { useState, useEffect } from "react";
import { NavBar } from "./navbar";
import { Container } from "@mui/system";
import { grey } from "@mui/material/colors";
import { Typography, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import UserList from "./components/views/userList";
import UserCard from "./components/cards/userCard";
import utils from "./utils/getData.js";

export const FollowingList = () => {
  const token = localStorage.getItem("access_token");

  const [followingUsers, setFollowingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUser, setFilteredUser] = useState(null);

  // Función para obtener los usuarios seguidos
  const fetchFollowingUsers = async () => {
    try {
      const userData = await utils.getUserData(token); // Datos del usuario actual
      const users = await utils.getFollowing(token, userData.id); // Usuarios seguidos
      if (Array.isArray(users)) {
        setFollowingUsers(users); // Actualizar el estado
      } else {
        console.warn("El backend no devolvió un arreglo.");
        setFollowingUsers([]); // Estado vacío en caso de error
      }
    } catch (error) {
      console.error("Error al obtener usuarios seguidos:", error);
      setFollowingUsers([]); // Estado vacío en caso de error
    }
  };

  // Función para obtener todos los usuarios
  const fetchAllUsers = async () => {
    try {
      const allUsersData = await utils.getAllUsers(token);
      if (Array.isArray(allUsersData)) {
        setAllUsers(allUsersData);
      } else {
        console.warn("El backend no devolvió un arreglo.");
        setAllUsers([]);
      }
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      setAllUsers([]);
    }
  };

  // Sincronizar el estado "following" de los usuarios
  const updateAllUsersFollowing = () => {
    const followingIds = new Set(followingUsers.map((item) => item.id));
    const updatedArray = allUsers.map((item) => ({
      ...item,
      following: followingIds.has(item.id),
    }));
    setAllUsers(updatedArray);
  };

  // Usar useEffect para evitar re-renderizados infinitos
  useEffect(() => {
    if (followingUsers.length === 0) {
      fetchFollowingUsers();
    }
  }, [followingUsers]);

  useEffect(() => {
    if (allUsers.length === 0) {
      fetchAllUsers();
    }
  }, [allUsers]);

  useEffect(() => {
    if (followingUsers.length > 0 && allUsers.length > 0) {
      updateAllUsersFollowing();
    }
  }, [followingUsers, allUsers]);

  // Manejar búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
    const user = allUsers.find((u) =>
      u.username.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUser(user || null);
  };

  return (
    <Container
      disableGutters
      className="home-container"
      maxWidth="false"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <NavBar />

      {/* Barra de búsqueda */}
      <Box
        sx={{
          mt: 1,
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "2rem",
          position: "relative",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search following users..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          size="small"
          sx={{
            width: "20%",
            marginRight: "1rem",
          }}
        />

        {/* Mostrar el usuario encontrado */}
        {searchTerm && (
          <Box
            sx={{
              position: "absolute",
              marginRight: '1rem',
              top: "50px",
              width: "20%",
              backgroundColor: "white",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              zIndex: 10,
            }}
          >
            <UserCard user={filteredUser} verticalLayout={true}/>
          </Box>
        )}
      </Box>

      {/* Título */}
      <Box sx={{ mt: 4, flexShrink: 0 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            color: grey[800],
          }}
        >
          Users You Are Following:
        </Typography>
      </Box>

      {/* Lista de usuarios seguidos */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          mt: 4,
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "600px",
            maxHeight: "70vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <UserList users={followingUsers} />
        </Box>
      </Box>
    </Container>
  );
};
