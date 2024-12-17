import { App } from "./App.jsx";
import "./styles/index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

createRoot(document.getElementById("root")).render(
  <>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>
);
