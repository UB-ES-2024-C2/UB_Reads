import profileImage from "../assets/avatarImg.png";

const getUserData = async (token) => {
  // Objeto por defecto para el usuario
  let userData = {
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
    if ("username" in data) userData.usernameSTR = data.username;
    if ("email" in data) userData.emailSTR = data.email;
    if ("image" in data) userData.profImage = data.image;

    return userData; // Retornar los datos del usuario
  } catch (error) {
    // Manejo de errores de red o del servidor
    console.error("Error en la solicitud:", error);
    return userData; // Retornar datos por defecto en caso de error
  }
};

export default getUserData;
