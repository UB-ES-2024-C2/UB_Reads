import {NavBar} from "./navbar";
import {Typography} from "@mui/material";
import {blue} from "@mui/material/colors";
import {Container} from "@mui/system";
import React from "react";

export const FriendList = () => {
  return (
    <Container disableGutters className="home-container" maxWidth="false">
        <NavBar/>
        <div id="home-content-container">
          <Typography variant="h2" align="center" sx={{ fontWeight: 'bold', color: blue[800], alignSelf: 'center', justifySelf: 'center' }}>
            Friend list
            Not implemented yet
          </Typography>
        </div>
      </Container>
  );
}