import React, { useState } from "react";
import { grey, red, green } from "@mui/material/colors";
import { Avatar, Button, ListItem, ListItemAvatar, Typography, Box } from "@mui/material";

export const UserCard = ({ user, verticalLayout = false }) => {
  const [isFollowing, setIsFollowing] = useState(user?.following || false);

  const handleFollowChange = () => {
    if (isFollowing) {
      console.log('unfollowbutton ', user.username);
      onFollowChange(user.id, false);
    } else {
      console.log('followbutton ', user.username);
      onFollowChange(user.id, true);
    }
    setIsFollowing(!isFollowing);
  };

  const getButton = (following) => {
    const buttonStyles = {
      backgroundColor: following ? red["A700"] : green["A700"],
      color: "white",
      textTransform: "none",
      fontWeight: "bold",
      borderRadius: "20px",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: following ? red[900] : green[900],
      },
      marginTop: verticalLayout ? 1 : 0,
      alignSelf: verticalLayout ? "center" : "flex-start",
    };

    return (
      <Button
        variant="contained"
        sx={buttonStyles}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    );
  };

  if (!user) {
    return (
      <ListItem
        key={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: 2,
          backgroundColor: grey[100],
          borderRadius: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          sx={{
            color: red["A700"],
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          No s'ha trobat l'usuari
        </Typography>
      </ListItem>
    );
  }

  return (
    <ListItem
      key={user.id}
      sx={{
        display: "flex",
        flexDirection: verticalLayout ? "column" : "row",
        alignItems: "center",
        width: "100%",
        padding: 2,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            fontSize: "1.5rem",
            backgroundColor: grey[400],
            color: "white",
          }}
        >
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: verticalLayout ? "center" : "flex-start",
          textAlign: verticalLayout ? "center" : "left",
          marginLeft: verticalLayout ? 0 : 2,
          marginTop: verticalLayout ? 1 : 0,
          flex: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {user.username}
        </Typography>
        <Typography variant="body2" sx={{ color: grey[600] }}>
          {user.email}
        </Typography>
      </Box>
      {getButton(isFollowing)}
    </ListItem>
  );
};
