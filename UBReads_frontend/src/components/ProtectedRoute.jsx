import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('access_token'); // Check for access token

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
