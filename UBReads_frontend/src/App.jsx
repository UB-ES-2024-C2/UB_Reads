// Style Import
import "./styles/App.css";

// Components import
import { Home } from "./home";
import { Login } from "./login";
import { SignupForm } from "./signup";
import { Profile } from "./userProfile";
import { FriendList } from "./friendList";

// BrowserRouter import
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute'

// React Component
const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/userProfile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <FriendList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;