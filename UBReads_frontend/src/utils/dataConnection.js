import profileImage from "../assets/avatarImg.png";

class dataConnection {
  static getUserData = async (token) => {
    let userData = {
      usernameSTR: "Username",
      emailSTR: "username@example.com",
      profImage: profileImage,
    };

    try {
      const response = await fetch("http://localhost:8000/me", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        alert("Ocurrió un error de credenciales.");
        return userData;
      }

      const data = await response.json();

      if ("username" in data) userData.usernameSTR = data.username;
      if ("email" in data) userData.emailSTR = data.email;
      if ("image" in data) userData.profImage = data.image;

      return userData;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return userData;
    }
  };

  static deleteUser = async (token) => {
    try {
      const response = await fetch("http://localhost:8000/users-delete", {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      //TODO confirmar resposta del back


      return true;
    } catch (error) {
      alert('Caught error from back')
      console.error("Error en la solicitud:", error);
      return false;
    }
  };


  static generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+/?,<>.:;{}[]()-*&^%$#@!~';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

export default dataConnection;
