import "./styles/signup.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate

export const SignupForm = () => {
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
            Ens alegrem de tenir-te aquí. Siusplau, crea un nou compte per poder accedir a <b>UB Reads</b>
          </p>
        </div>
        <div className="login-container">
          {/* Contenedor para el formulario */}
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            {" "}
            {/* Vincular la función al evento onSubmit */}
            <label htmlFor="username">Nom d'usuari:</label>
            <input type="text" id="username" required/>

            <label htmlFor="email">Introdueix un Email</label>
            <input type="email" id="email" required/>

            <label htmlFor="password">Contrasenya:</label>
            <input type="password" id="password" required/>

            <label htmlFor="password2">Repeteix la contrasenya:</label>
            <input type="password" id="password2" required/>

            <button type="submit">Envia</button>
            {/* Botón para enviar */}
          </form>
          <p>
            Ja tens un compte? <Link to="/">Logueja't aquí</Link>
          </p>
        </div>
      </div>
    </main>
  );
};
