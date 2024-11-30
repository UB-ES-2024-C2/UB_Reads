import React from "react";
import { grey, red, green } from "@mui/material/colors";
import { Avatar, Button, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";

const UserCard = ({ user }) => {
  const getButton = (following) => {
    if (following) {
      return (
        <Button
          variant="contained"
          sx={{ backgroundColor: red["A700"], color: "white" }}
        >
          Unfollow
        </Button>
      );
    }
    return (
      <Button
        variant="contained"
        sx={{ backgroundColor: green["A700"], color: "white" }}
      >
        Follow
      </Button>
    );
  };

  if (user === null) {
    return (
      <ListItem
        key={0}
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
        <ListItemText
          primary={
            <Typography style={{ color: red["A700"] }}>
              User not found
            </Typography>
          }
          sx={{ marginLeft: 2 }} // Add spacing between avatar and text
        />
      </ListItem>
    );
  }
  return (
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
      {getButton(user.following)}
    </ListItem>
  );
};

export default UserCard;
