// Style Import
import "./styles/App.css";

// Components import
import { LoginPage, SignupPage, HomePage } from "./components";

// BrowserRouter import
import { Route, Routes, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const hasToken = localStorage.getItem('access_token'); // Check for access token
  return hasToken ? children : <Navigate to="/" />;
};

/**
 * Main App component
 * @returns 
 */
export const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage />}
      />
      <Route
        path="/signup"
        element={<SignupPage />}
      />
      <Route
        path="/home/*"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}