import React from "react";
import Box from "@mui/material/Box";
import UserCard from "../cards/userCard";

const UserList = ({ users }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {users.map((user) => (
        <UserCard user={user}></UserCard>
      ))}
    </Box>
  );
};


export default UserList;
