import React from "react";
import Box from "@mui/material/Box";
import UserCard from "../cards/userCard";

const UserList = ({ users, onFollowChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {users.map((user) => (
        <UserCard key={user.id} user={user} onFollowChange={onFollowChange} />
      ))}
    </Box>
  );
};

export default UserList;
