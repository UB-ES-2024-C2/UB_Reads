import profileImage from "../assets/avatarImg.png";
import backendAPI from "../backend-api.js";

const getUserData = async (token) => {
  // Objeto por defecto para el usuario
  const userData = {
    usernameSTR: "Username",
    emailSTR: "username@example.com",
    profImage: profileImage,
  };

  try {
    // Solicitud al endpoint /me
    const response = await backendAPI.get(`/me`, {
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
    });

    // Verificar si la respuesta no es exitosa
    if (response.status !== 200) {
      console.warn("Error de credenciales o respuesta no válida.");
      return userData; // Retornar datos por defecto en caso de error
    }

    // Parsear la respuesta JSON

    // Asignar valores si están presentes en la respuesta
    if (response.data.username) userData.usernameSTR = response.data.username;
    if (response.data.email) userData.emailSTR = response.data.email;
    if (response.data.image) userData.profImage = response.data.image;
    if (response.data.id) userData.id = response.data.id;

    return userData; // Retornar los datos del usuario
  } catch (error) {
    // Manejo de errores de red o del servidor
    console.error("Error en la solicitud:", error);
    return userData; // Retornar datos por defecto en caso de error
  }
};

const deleteUser = async (token) => {
  try {
    const response = await fetch("http://localhost:8000/users-delete/", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Se asegura de que el token esté en el formato correcto
      },
    });

    if (!response.ok) {
      console.warn("La solicitud DELETE no fue exitosa.");
      return false;
    }
    
    return true;
  } catch (error) {
    alert("Caught error from back");
    console.error("Error en la solicitud:", error);
    return false;
  }
};

// Generador de cadenas aleatorias
const generateRandomString = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+/?,<>.:;{}[]()-*&^%$#@!~";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

// Exportación de las funciones
export default { getUserData, deleteUser, generateRandomString };
