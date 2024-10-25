import "./styles/App.css";
import { Login } from "./login";
import { Route, Routes } from "react-router-dom"; // Importa BrowserRouter
import { SignupForm } from "./signup";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />
    </Routes>
  );
}

export default App;
