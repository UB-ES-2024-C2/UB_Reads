import "./styles/login.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate

export const Login = () => {
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    // Aquí puedes agregar lógica de validación de login o autenticación si es necesario

    // Redirigir a la página de inicio (por ejemplo, '/home')
    navigate("/home");
  };

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
          <h2>Login</h2>
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
            No tens un compte? <Link to="/registre">Registra't aquí</Link>{" "}
            {/* Link al registro */}
          </p>
        </div>
      </div>
    </main>
  );
};
