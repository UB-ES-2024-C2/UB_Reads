import profileImage from "../assets/avatarImg.png";
import backendAPI from "../backend-api.js";

class getData {

  async getAllUsers(token, userId) {
    try {
      const response = await backendAPI.get(`/users`, {
          headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response !== 200) {
        console.warn("Error al obtener todos los usuarios.");
        return [];
      }
  
      const users = await response.data; // Suponiendo que el backend devuelve un array de usuarios
  
      // Filtrar para eliminar el usuario con el id correspondiente
      return users.filter(user => user.id !== userId);
    } catch (error) {
      console.error("Error en la solicitud para obtener usuarios:", error);
      return [];
    }
  };
  
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
  };

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
  };

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

  async followUserWithId(token, userId, toFollowId){
    try {
      const response = await backendAPI.post(`/${userId}/follow/${toFollowId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response !== 200) {
        console.warn("Error al seguir al usuario.");
        return false;
      }
  
      const data = response.data;
      console.log(data.message);
      return true;
    } catch (error) {
      console.error("Error en la solicitud para seguir a un usuario:", error);
      return false;
    }
  };
  
  async followUserWithName(token, username, toFollowUsername){
    try {
      const response = await backendAPI.post(`/users/${username}/follow/${toFollowUsername}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response !== 200) {
        console.warn("Error al seguir al usuario.");
        return false;
      }
  
      const data = response.data;
      console.log(data.message); // Mensaje de éxito
      return true;
    } catch (error) {
      console.error("Error en la solicitud para seguir a un usuario:", error);
      return false;
    }
  };
  
  
  async unfollowUser(token, userId, toUnfollowId){
    try {
      const response = await backendAPI.delete(`/${userId}/unfollow/${toUnfollowId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response !== 200) {
        console.warn("Error al dejar de seguir al usuario.");
        return false;
      }
  
      const data = response.data;
      console.log(data.message);
      return true;
    } catch (error) {
      console.error("Error en la solicitud para dejar de seguir a un usuario:", error);
      return false;
    }
  };
  
  async getFollowers(token, userId){
    try {
      const response = await backendAPI.get(`/${userId}/followers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response !== 200) {
        console.warn("Error al obtener la lista de seguidores.");
        return [];
      }
  
      const data = response.data;
      return data.followers;
    } catch (error) {
      console.error("Error en la solicitud para obtener seguidores:", error);
      return [];
    }
  };

  async getFollowing(token, userId) {
    try {
      const response = await backendAPI.get(`/${userId}/following`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
  
      if (response !== 200) {
        console.warn("Error al obtener la lista de usuarios seguidos.");
        return [];
      }
  
      const data = response.data;
  
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

}

export default new getData();
