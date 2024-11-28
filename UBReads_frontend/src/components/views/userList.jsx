import React from "react";
import { ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import {grey} from "@mui/material/colors";

const UserList = ({ users }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2, // Adds spacing between list items
      }}
    >
      {users.map((user) => (
        <ListItem
          key={user.id}
          sx={{
            display: "flex",
            flexDirection: "row", // Ensure avatar and text are in a row
            alignItems: "center", // Align items vertically in the center
            width: "100%", // Take full width of the container
            padding: 1, // Add padding to the list item
            backgroundColor: grey[100], // Optional: Add slight background for each item
            borderRadius: 2, // Add rounded corners
          }}
        >
          <ListItemAvatar>
            <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user.username}
            secondary={user.email}
            sx={{ marginLeft: 2 }} // Add spacing between avatar and text
          />
        </ListItem>
      ))}
    </Box>
  );
};


export default UserList;
