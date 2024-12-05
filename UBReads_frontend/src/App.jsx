// Style Import
import "./styles/App.css";

// Components import
import { LoginPage, SignupPage, HomePage } from "./components";

// BrowserRouter import
import { Route, Routes, Navigate } from "react-router-dom";

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
        element={(localStorage.getItem('access_token') ? <HomePage /> : <Navigate to="/" replace />)}
      />
    </Routes>
  );
}