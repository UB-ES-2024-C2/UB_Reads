import { NavBar } from "./navbar";
import { Container } from "@mui/system";
import React, { useState } from "react";
import UserList from "./components/views/userList";
import { grey } from "@mui/material/colors";
import { Typography, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { getAllUsers } from "./utils/getData"

export const FollowingList = () => {

  const users = getAllUsers().catch();
  console.log(users);



  const getFollowing = () => {
    // TODO

    return users;
    return Array.from({ length: 15 }, (_, x) => ({
      id: x,
      username: String.fromCharCode(x + 97),
      email: "email@example.com",
    }));
  };

  const allFollowing = getFollowing();
  const [searchTerm, setSearchTerm] = useState("");

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
          justifyContent: "flex-end", // Align search bar to the right
          paddingRight: "2rem", // Adds padding from the right side
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search new users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "250px" }} // Adjust width as needed
        />
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
