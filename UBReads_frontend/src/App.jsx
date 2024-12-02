// Style Import
import "./styles/App.css";

// Components import
import { Login, Signup, Home } from "./components";

// BrowserRouter import
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute'

/**
 * Main App component
 * @returns 
 */
const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route path="/home/*" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;