import backendAPI from '../api/backend-api';

class UserService {

    /**
     * Auxiliar function used to create a user object from the backend user data
     * @param {Object} user backend user data
     * @returns Object with user data
     */
    createUserFromBacken(user) {
        return {
            profImage: user.profile_pic,
            id: user.id ? user.id : null,
            usernameSTR: user.username ? user.username : "Username",
            emailSTR: user.email ? user.email : "username@example.com",
        };
    }

    /**
     * Returns all the users from the backend
     * @param {String} token used to identify the user
     */
    async getAllUsers(token) {
        // Get all users from the backend
        const response = await backendAPI.get(`/users`);
        // Get user data
        const currentUser = await this.getUserData(token);
        // Manage errors
        switch (response.status) {
            case 200:
                return response.data.filter(user => user.id !== currentUser.id);
            case 500:
                throw new Error('Error intern en el servidor');
        }
    }

    /**
     * Return the user data given a token
     * @param {String} token used to identify the user
     * @returns Object with user data
     */
    async getUserData(token) {
        // Get the user data from the token
        const response = await backendAPI.get(`/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        // Manage response
        switch (response.status) {
            case 200:
                return this.createUserFromBacken(response.data);
            case 400:
                throw new Error('Usuari no trobat');
            case 500:
                throw new Error('Error intern en el servidor');
        }
    }

    /**
     * Deletes a user from the backend
     * @param {String} token used to indentify the user
     */
    async deleteUser(token) {
        // Send the delete request
        const response = await backendAPI.delete(`/users-delete/`, {
          headers: {
              'Authorization': `Bearer ${token}`,
          }
        });
        // Manage errors
        switch(response.status) {
            case 400:
                throw new Error('Usuari no trobat');
            case 500:
                throw new Error('Error intern en el servidor');
        }

    };

    /**
     * Returns a tocken if the login is successful
     * @param {String} username 
     * @param {String} password
     */
    async getLogin(username, password) {
        // Create the form data
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        // Send the login request
        const response = await backendAPI.post('/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        // Manage response
        switch (response.status) {
            case 200:
                return response.data.access_token;
            case 400:
                alert('Credencials invàlides');
                throw new Error('Usuari no trobat');
            case 500:
                throw new Error('Error intern en el servidor');
        }
    }

    /**
     * Creates a new user
     * @param {String} username 
     * @param {String} email 
     * @param {String} password 
     * @param {String} profile_pic
     */
    async signup(username, email, password, profile_pic) {
        // Send the signup request
        await backendAPI.post('/users/', {username, email, password, profile_pic});
    };
}

export default new UserService();
