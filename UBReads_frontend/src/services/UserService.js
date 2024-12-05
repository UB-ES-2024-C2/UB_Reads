import backendAPI from '../api/backend-api';

class UserService {

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
            profImage: data.data.image,
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

    async getLogin(username, password) {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        try {
            const response = await backendAPI.post('/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
    
            if (response.status === 200) {
                return response.data.access_token;
            }

            alert("Credenciales inválidas");
            return null;
            
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Ocurrió un error. Inténtalo de nuevo más tarde.");
        }
    }

    
    async signup(username, email, password) {
        try {
            await backendAPI.post('/users/', {username, email, password});
        } catch (error) {
            console.error("Error connecting to the backend:", error);
            alert(`There was a problem connecting to the server: ${error.message}`);
        }
    };
}

export default new UserService();
