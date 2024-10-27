import "./styles/App.css";
import { Home } from "./home";
import { Login } from "./login";
import { SignupForm } from "./signup";
import { Route, Routes } from "react-router-dom"; // Importa BrowserRouter


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
