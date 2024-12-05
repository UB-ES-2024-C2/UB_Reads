import backendAPI from '../backend-api';

class FollowerService {
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

}

export default new FollowerService();