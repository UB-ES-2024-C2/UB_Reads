import profileImage from "../assets/avatarImg.png";
import backendAPI from "../backend-api.js";

class getData {
  async getUserData(token) {

    const data = await backendAPI.get(`/me`, {
      headers: {
          'Authorization': `Bearer ${token}`,
      }
    });

    if (data.status === 200) {
      return {
        id: data.data.id ? data.data.id : null,
        profImage: data.data.image ? data.data.image : profileImage,
        usernameSTR: data.data.username ? data.data.username : "Username",
        emailSTR: data.data.email ? data.data.email : "username@example.com",
      };
    }
    console.warn("Error de credenciales o respuesta no válida.");
  }

  async deleteUser(token) {
    const response = await backendAPI.delete(`/users-delete/`, {
      headers: {
          'Authorization': `Bearer ${token}`,
      }
    });

    if(response.status === 200) {
      return true;
    }

    console.warn("La solicitud DELETE no fue exitosa.");
    return false;
  }

  async generateRandomString() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+/?,<>.:;{}[]()-*&^%$#@!~";
    let result = "";
    const charactersLength = characters.length;
  
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  };
}

export default new getData();
