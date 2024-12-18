import "./login.css";

import UserService from "../../services/UserService.js"
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate

export const LoginPage = () => {
  const navigate = useNavigate(); // Hook para redirigir
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    // Aquí puedes agregar lógica de validación de login o autenticación si es necesario
    // Obtener los valores de los campos de entrada
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const token = await UserService.getLogin(username, password);
      localStorage.setItem("access_token", token);

      if (token) {
        localStorage.setItem("access_token", token); // Store the token
        navigate("/home"); // Redirect to home if token exists
      }
    }
    catch (error) {
      console.error("Error al iniciar sessió:", error);
    }
  }
  return (
    <main className="main-container">
      <div className="central-container">
        {/* Contenedor paralelo para el mensaje de bienvenida */}
        <div className="welcome-container">
          <h2>Benvingut a UBReads!</h2>
          <p>
            Ens alegrem de tenir-te aquí. Siusplau, inicia sessió per accedir al
            teu compte.
          </p>
        </div>
        <div className="login-container">
          {/* Contenedor para el formulario */}
          <h2>Iniciar sessió</h2>
          <form onSubmit={handleSubmit}>
            {" "}
            {/* Vincular la función al evento onSubmit */}
            <label htmlFor="username">Nom d'usuari:</label>
            <input type="text" id="username" required />
            <label htmlFor="password">Contrasenya:</label>
            <input type="password" id="password" required />
            <button type="submit">Envia</button> {/* Botón para enviar */}
          </form>
          <p>
            No tens un compte? <Link to="/signup">Registra't aquí</Link>{" "}
            {/* Link al registro */}
          </p>
        </div>
      </div>
    </main>
  );
};
