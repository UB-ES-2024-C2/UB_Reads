import "./styles/App.css";
import { Login } from "./login";
import { Route, Routes } from "react-router-dom"; // Importa BrowserRouter


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
