// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { NavBar } from "./navbar";  // Component

import { Container } from "@mui/system";

import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import { pink, blue } from "@mui/material/colors";

import profileImage from './assets/avatarImg.png';

export const Profile = () => {
  const [hover, setHover] = useState(false);

  const buttonStyle = { background: hover ? pink[500] : pink[400] };

  return (
    <Container disableGutters className="home-container" maxWidth="false" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <NavBar />
      <Container className="content-container" maxWidth="false" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Card
          data-resizable
          sx={{
            textAlign: 'center',
            alignItems: 'center',
            width: 343,
            overflow: 'auto',
            '--icon-size': '100px',
          }}
        >
          <CardOverflow variant="solid" sx={{bgcolor: blue[800]}}>
            <AspectRatio
              variant="outlined"
              ratio="1"
              sx={{
                m: 'auto',
                transform: 'translateY(50%)',
                borderRadius: '50%',
                width: 'var(--icon-size)',
                boxShadow: 'sm',
                bgcolor: 'background.surface',
                position: 'relative',
                color: blue[800],
              }}
            >
              <div>
                <img src={profileImage} alt="User avatar"/>
              </div>
            </AspectRatio>
          </CardOverflow>
          <CardContent sx={{maxWidth: '40ch'}}>
            <div>
              <Typography level="title-lg" sx={{mt: 'calc(var(--icon-size) / 2)', color: blue[800]}}>
                Nom d&#39;usuari
              </Typography>
              <Typography level="body-lg">
                Username
              </Typography>
            </div>
            <div>
              <Typography level="title-lg" sx={{mt: '3vh', color: blue[800]}}>
                Correu electrònic
              </Typography>
              <Typography level="body-lg">
                username@example.com
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="solid"
          style={buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{maxWidth: '20ch'}}
        >
          <b>Eliminar Compte</b>
        </Button>
      </Container>
    </Container>
  );
};
