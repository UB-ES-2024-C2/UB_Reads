import { NavBar } from "./navbar";
import { Container } from "@mui/system";
import React, { useState } from "react";
import UserList from "./components/views/userList";
import { grey } from "@mui/material/colors";
import {Box, TextField, Button, Typography} from '@mui/material';

export const FollowingList = () => {

  const getFollowing = () => {
    // TODO

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
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '2rem',
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        sx={{
          width: '250px',
          marginRight: '1rem',
          '& .MuiOutlinedInput-root': {
            height: '40px',
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="small"
        sx={{
          textTransform: 'none',
          height: '40px',
          minWidth: '120px',
        }}
      >
        Cerca Usuari
      </Button>
    </Box>

      {/* Title centered */}
      <Box sx={{mt: 4, flexShrink: 0}}>
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
