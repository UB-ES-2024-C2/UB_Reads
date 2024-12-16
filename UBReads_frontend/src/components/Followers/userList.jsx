import React from "react";
import Box from "@mui/material/Box";
import { UserCard } from "./userCard";

export const UserList = ({ users }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {users.map((user) => (
        <UserCard key={user.id} user={user}  />
      ))}
    </Box>
  );
};
