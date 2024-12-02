import profileImage from "../assets/avatarImg.png";

const getAllUsers = async (token, userId) => {
  try {
    const response = await fetch("http://localhost:8000/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Error al obtener todos los usuarios.");
      return [];
    }

    const users = await response.json(); // Suponiendo que el backend devuelve un array de usuarios

    // Filtrar para eliminar el usuario con el id correspondiente
    return users.filter(user => user.id !== userId);
  } catch (error) {
    console.error("Error en la solicitud para obtener usuarios:", error);
    return [];
  }
};


const getUserData = async (token) => {
  // Objeto por defecto para el usuario
  const userData = {
    id: 0,
    usernameSTR: "Username",
    emailSTR: "username@example.com",
    profImage: profileImage,
  };

  try {
    // Solicitud al endpoint /me
    const response = await fetch("http://localhost:8000/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Se asegura de que el token esté en el formato correcto
      },
    });

    // Verificar si la respuesta no es exitosa
    if (!response.ok) {
      console.warn("Error de credenciales o respuesta no válida.");
      return userData; // Retornar datos por defecto en caso de error
    }

    // Parsear la respuesta JSON
    const data = await response.json();

    // Asignar valores si están presentes en la respuesta
    if (data.id) userData.id = data.id;
    if (data.username) userData.usernameSTR = data.username;
    if (data.email) userData.emailSTR = data.email;
    if (data.image) userData.profImage = data.image;

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

const followUserWithId = async (token, userId, toFollowId) => {
  try {
    const response = await fetch(`http://localhost:8000/${userId}/follow/${toFollowId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Error al seguir al usuario.");
      return false;
    }

    const data = await response.json();
    console.log(data.message);
    return true;
  } catch (error) {
    console.error("Error en la solicitud para seguir a un usuario:", error);
    return false;
  }
};

const followUserWithName = async (token, username, toFollowUsername) => {
  try {
    const response = await fetch(
      `http://localhost:8000/users/${username}/follow/${toFollowUsername}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.warn("Error al seguir al usuario.");
      return false;
    }

    const data = await response.json();
    console.log(data.message); // Mensaje de éxito
    return true;
  } catch (error) {
    console.error("Error en la solicitud para seguir a un usuario:", error);
    return false;
  }
};


const unfollowUser = async (token, userId, toUnfollowId) => {
  try {
    const response = await fetch(`http://localhost:8000/${userId}/unfollow/${toUnfollowId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Error al dejar de seguir al usuario.");
      return false;
    }

    const data = await response.json();
    console.log(data.message);
    return true;
  } catch (error) {
    console.error("Error en la solicitud para dejar de seguir a un usuario:", error);
    return false;
  }
};

const getFollowers = async (token, userId) => {
  try {
    const response = await fetch(`http://localhost:8000/${userId}/followers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Error al obtener la lista de seguidores.");
      return [];
    }

    const data = await response.json();
    return data.followers;
  } catch (error) {
    console.error("Error en la solicitud para obtener seguidores:", error);
    return [];
  }
};

const getFollowing = async (token, userId) => {
  try {
    const response = await fetch(`http://localhost:8000/${userId}/following`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Error al obtener la lista de usuarios seguidos.");
      return [];
    }

    let data = await response.json();

    // Com que aquesta funcio nomes retorna usuaris que estas seguin, els hi podem posar a tots following true
    data.following = data.following.map(item => ({
      ...item,
      following: true
    }));

    return data.following;
  } catch (error) {
    console.error("Error en la solicitud para obtener usuarios seguidos:", error);
    return [];
  }
};

// Exportar todas las funciones
export default {
  getAllUsers,
  getUserData,
  deleteUser,
  generateRandomString,
  followUserWithId,
  followUserWithName,
  unfollowUser,
  getFollowers,
  getFollowing,
};
