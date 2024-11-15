// Style Import
import "./styles/App.css";

// Components import
import { Home } from "./home";
import { Login } from "./login";
import { SignupForm } from "./signup";
import { Profile } from "./userProfile";

// BrowserRouter import
import { Route, Routes } from "react-router-dom";

// React Component
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/home" element={<Home />} />
      <Route path="/userProfile" element={<Profile />} />
    </Routes>
  );
}

export default App;