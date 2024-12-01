import { NavBar } from "./navbar";
import { Container } from "@mui/system";
import React, { useState } from "react";
import UserList from "./components/views/userList";
import { grey } from "@mui/material/colors";
import { Typography, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import UserCard from "./components/cards/userCard";

export const FollowingList = () => {
  const getFollowing = () => {
    return Array.from({ length: 15 }, (_, x) => ({
      id: x,
      username: String.fromCharCode(x + 97),
      email: "email@example.com",
      following: Math.random() < 0.5,
    }));
  };

  const allFollowing = getFollowing();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUser, setFilteredUser] = useState(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const user = allFollowing.find((u) =>
      u.username.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUser(user || null); // Null if no match found
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
      {/* Search bar under the navbar, aligned to the top-right corner */}
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
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          size="small"
          sx={{
            width: "20%",
            marginRight: "1rem",
          }}
        />

        {/* Dropdown with UserCard */}
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
            <UserCard user={filteredUser} />
          </Box>
        )}
      </Box>

      {/* Title centered */}
      <Box sx={{ mt: 4, flexShrink: 0 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            color: grey[800],
          }}
        >
          You are currently following:
        </Typography>
      </Box>

      {/* Users List */}
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
          <UserList users={allFollowing} />
        </Box>
      </Box>
    </Container>
  );
};
