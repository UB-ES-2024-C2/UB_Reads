// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';

import { Container } from "@mui/system";

import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import { pink, blue } from "@mui/material/colors";


import UserService from "../../services/UserService.js";
import { useNavigate } from "react-router-dom";
import { Avatar } from '@mui/material';

export const ProfileView = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [userData, setUserData] = useState({
    username: "Username",
    email: "username@example.com",
    image: "",
  });

  function generateRandomString() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+/?,<>.:;{}[]()-*&^%$#@!~";
    let result = "";
    const charactersLength = characters.length;
  
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  };

  const buttonStyle = { background: hover ? pink[500] : pink[400] };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const data = await UserService.getUserData(token);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const deleteAccount = async () => {
    const token = localStorage.getItem("access_token");
    const randomSTR = generateRandomString(); // Generate a random string
    const answer = prompt("Per confirmar que vols eliminar el compte, introdueix el text al requadre:\n\n" + randomSTR);

    if (answer === randomSTR) {
      try {
        const result = await UserService.deleteUser(token);
        if(result) {
          alert('L\'usuari s\'ha eliminat correctament de la base de dades.\n' +
            'Seguidament seras redirigit a la pàgina de login.')
          localStorage.removeItem('access_token');
          navigate("/");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }

    } else {
        alert('El text no coincideix. No s\'eliminarà el compte.');
    }
};

  return (
    <Container disableGutters className="home-container" maxWidth="false" sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '85%'
    }}>
      <Container className="content-container" maxWidth="false" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}>
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
                <Avatar src={userData.image} sx={{width: '100%', height: '100%'}} />
              </div>
            </AspectRatio>
          </CardOverflow>
          <CardContent sx={{maxWidth: '40ch'}}>
            <div>
              <Typography level="title-lg" sx={{mt: 'calc(var(--icon-size) / 2)', color: blue[800]}}>
                Nom d&#39;usuari
              </Typography>
              <Typography level="body-lg">
                {userData['username']}
              </Typography>
            </div>
            <div>
              <Typography level="title-lg" sx={{mt: '3vh', color: blue[800]}}>
                Correu electrònic
              </Typography>
              <Typography level="body-lg">
                {userData['email']}
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="solid"
          style={buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={deleteAccount}
          sx={{maxWidth: '20ch'}}
        >
          <b>Eliminar Compte</b>
        </Button>
      </Container>
    </Container>
  );
};