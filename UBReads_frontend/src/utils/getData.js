import profileImage from "../assets/avatarImg.png";

const getUserData = async (token) => {
  let userData = {
    usernameSTR: "Username",
    emailSTR: "username@example.com",
    profImage: profileImage,
  };

  try {
    const response = await fetch("http://localhost:8000/me", {
      method: "GET",
      headers: {
        Authorization: token, // Correct header format
      },
    });

    if (!response.ok) {
      alert("Ocurrió un error de credenciales.");
      return userData;
    }

    const data = await response.json(); // Await the JSON parsing

    if ("username" in data) userData.usernameSTR = data.username;
    if ("email" in data) userData.emailSTR = data.email;
    if ("image" in data) userData.profImage = data.image;

    return userData;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    //alert("Ocurrió un error. Inténtalo de nuevo más tarde.");
    return userData; // Return default userData in case of error
  }
};

export default getUserData; // Correct export
