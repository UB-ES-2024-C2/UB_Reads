// API
import backendAPI from '../api/backend-api';

// Auxiliar services
import UserService from './UserService.js';

class FollowerService {
    /**
     * Follows a user given the token and the username of the user to follow
     * @param {String} token token of the user
     * @param {String} toFollowUsername username of the user to follow
     */
    async followUserByUsername(token, toFollowUsername) {
        // Get the user data from the token
        console.log(toFollowUsername)
        const user = await UserService.getUserData(token);
        const response = await backendAPI.post(`users/${user.usernameSTR}/follow/${toFollowUsername}`);
        // Manage errors
        switch (response.status) {
            case 400:
                throw new Error('Usuari no trobat');
            case 500:
                throw new Error('Error intern en el servidor');
            case 422:
                throw new Error('Format del user username o follow username incorrecte');
        }
    }

    /**
     * Unfollows a user given the token and the username of the user to unfollow
     * @param {String} token token used to identify the user
     * @param {String} toUnfollowUsername username of the user to unfollow
     */
    async unfollowUserByUsername(token, toUnfollowUsername) {
        // Finds the user to unfollow id
        const users = await UserService.getAllUsers(token);
        const userToUnfollow = users.find(user => user.username === toUnfollowUsername);
        // Get the user data from the token
        const user = await UserService.getUserData(token);
        // Send the request to the backend
        const response = await backendAPI.delete(`/${user.id}/unfollow/${userToUnfollow.id}`);
        // Manage errors
        switch (response.status) {
            case 400:
                return alert('Usuari no trobat');
            case 500:
                throw new Error('Error intern en el servidor');
            case 422:
                throw new Error('Format del user username o follow username incorrecte');
        }
    }

    /**
     * Returns the users followed by a user given its token
     * @param {String} token 
     * @returns 
     */
    async getUsersFollowed(token) {
        // Get the user data from the token
        const user = await UserService.getUserData(token);
        const response = await backendAPI.get(`/${user.id}/following`);
        // Manage errors
        switch (response.status) {
            case 200:
                return response.data.following;
            case 500:
                throw new Error('Error intern en el servidor');
            case 422:
                throw new Error('Format de ID incorrecte');
        }
    }

    /**
     * Returns the followers of a user given its token
     * @param {String} token used to identify the user
     */
    async getFollowers(token){
        // Get the user data from the token
        const user = await UserService.getUserData(token);
        const response = await backendAPI.get(`/${user.id}/followers`);
        // Manage errors
        switch (response.status) {
            case 200:
                return response.data.followers;
            case 500:
                throw new Error('Error intern en el servidor');
            case 422:
                throw new Error('Format de ID incorrecte');
        }
    };
}

export default new FollowerService();