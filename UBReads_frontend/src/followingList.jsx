import { NavBar } from "./navbar";
import { Container } from "@mui/system";
import React, { useState } from "react";
import UserList from "./components/views/userList";
import { grey } from "@mui/material/colors";
import { Typography, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import UserCard from "./components/cards/userCard";
import utils from "./utils/getData.js";

export const FollowingList = () => {
  const token = localStorage.getItem("access_token");
  const [followingUsers, setFollowingUsers] = useState([]); // Estado para usuarios seguidos
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [filteredUser, setFilteredUser] = useState(null); // Usuario filtrado

  // Función para obtener los usuarios seguidos por el usuario actual
  const fetchFollowingUsers = async () => {
    try {
      const userData = await utils.getUserData(token); // Obtiene los datos del usuario actual
      const users = await utils.getFollowing(token, userData.id); // Obtiene los usuarios seguidos
      if (Array.isArray(users)) {
        setFollowingUsers(users); // Actualiza el estado con los usuarios seguidos
      } else {
        console.warn("El backend no devolvió un arreglo.");
        setFollowingUsers([]); // Estado vacío en caso de error
      }
    } catch (error) {
      console.error("Error al obtener usuarios seguidos:", error);
      setFollowingUsers([]); // Estado vacío en caso de error
    }
  };

  // Llama a fetchFollowingUsers solo si followingUsers está vacío
  if (followingUsers.length === 0) {
    fetchFollowingUsers();
  }

  // Función para manejar la búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
    const user = followingUsers.find((u) =>
      u.username.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUser(user || null); // Null si no se encuentra coincidencia
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
        {searchTerm && filteredUser && (
          <Box
            sx={{
              position: "absolute",
              marginRight: "1rem",
              top: "50px",
              width: "20%",
              backgroundColor: "white",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              zIndex: 10,
              padding: "1rem",
            }}
          >
            <UserCard user={filteredUser} />
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
