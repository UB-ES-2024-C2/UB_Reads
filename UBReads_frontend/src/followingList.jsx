import { NavBar } from "./navbar";
import { Container } from "@mui/system";
import React from "react";
import UserList from "./components/views/userList";
import { grey } from "@mui/material/colors";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

export const FollowingList = () => {
  const getUsers = () => {
    // TODO: Update function once backend is working
    return Array.from({ length: 15 }, (_, x) => ({
      id: x,
      username: String.fromCharCode(x + 97),
      email: "email@example.com",
    }));
  };

  const users = getUsers();

  return (
    <Container
      disableGutters
      className="home-container"
      maxWidth="false"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent vertical scrolling
      }}
    >
      <NavBar />
      <Box sx={{ mt: 5, flexShrink: 0 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: "bold",
            color: grey[800],
          }}
        >
          You are currently following:
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          mt: 4, // Adds space between the text and the list
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "600px", // Restricts the list width
            maxHeight: "70vh", // Limits the list height
            overflowY: "auto", // Makes the list scrollable if needed
            display: "flex",
            flexDirection: "column",
            gap: 2, // Adds spacing between items
          }}
        >
          <UserList users={users} />
        </Box>
      </Box>
    </Container>
  );
};
