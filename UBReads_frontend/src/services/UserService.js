import backendAPI from '../backend-api';

class UserService {

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