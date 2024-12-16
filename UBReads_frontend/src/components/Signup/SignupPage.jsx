import "./signup.css";
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import UserService from "../../services/UserService.js";
import { Link, useNavigate } from "react-router-dom";
import foto1 from "../../assets/fotos_escritores/foto_1.webp";
import foto2 from "../../assets/fotos_escritores/foto_2.webp";
import foto3 from "../../assets/fotos_escritores/foto_3.webp";
import foto4 from "../../assets/fotos_escritores/foto_4.webp";
import foto5 from "../../assets/fotos_escritores/foto_5.webp";
import foto6 from "../../assets/fotos_escritores/foto_6.webp";
import foto7 from "../../assets/fotos_escritores/foto_7.webp";
import foto8 from "../../assets/fotos_escritores/foto_8.webp";
import foto9 from "../../assets/fotos_escritores/foto_9.webp";
import foto10 from "../../assets/fotos_escritores/foto_10.webp";

export const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);

  const [uNameError, setUnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [profilePicError, setProfilePicError] = useState("");

  const profilePics = [foto1,foto2, foto3, foto4, foto5, foto6, foto7, foto8, foto9, foto10];

  const validateUname = (username) => {
    if (username.length > 250) {
      return "El username no pot superar els 250 caràcters.";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length > 250) {
      return "El correu electrònic no pot superar els 250 caràcters.";
    } else if (!emailRegex.test(email)) {
      return "El format del correu electrònic no és vàlid.";
    }
    return "";
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.-])[A-Za-z\d@$!%*?&_.-]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "La contrasenya ha de tenir almenys 8 caràcters, 1 número, 1 majúscula, 1 minúscula i 1 caràcter especial [@$!%*?&_.-].";
    }
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Les contrasenyes no coincideixen.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uNameErorrMsg = validateUname(username);
    const emailErrorMsg = validateEmail(email);
    const passwordErrorMsg = validatePassword(password);
    const confirmPasswordErrorMsg = validateConfirmPassword(password, confirmPassword);

    if (!selectedProfilePic) {
      setProfilePicError("Has de seleccionar una foto de perfil.");
      return;
    }

    if (!emailErrorMsg && !passwordErrorMsg && !confirmPasswordErrorMsg) {
      try {
        await UserService.signup(username, email, password, selectedProfilePic);
        navigate("/");
      } catch (error) {
        alert(error.message || "Error during registration. Please try again.");
      }
    } else {
      setUnameError(uNameErorrMsg);
      setEmailError(emailErrorMsg);
      setPasswordError(passwordErrorMsg);
      setConfirmPasswordError(confirmPasswordErrorMsg);
    }
  };

  return (
    
    <main className="main-container">
      <div className="central-container">
        <div className="welcome-container">
          <h2>Benvingut a UBReads!</h2>
          <p>
            Ens alegrem de tenir-te aqu&iacute. Siusplau, crea un nou compte per poder accedir a <b>UB Reads</b>.
          </p>
        </div>
        <div className="signup-container">
          <h2>Crear nou compte</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Nom d&#39;usuari:</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {uNameError && <small style={{ color: "red" }}>{uNameError}</small>}

            <label htmlFor="email">Introdueix un correu electr&ogravenic</label>
            <input
              type="email"
              id="email"
              placeholder="example@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <small style={{ color: "red" }}>{emailError}</small>}

            <label htmlFor="password">Contrasenya:</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <small style={{ color: "red" }}>{passwordError}</small>}

            <label htmlFor="password2">Repeteix la contrasenya:</label>
            <input
              type="password"
              id="password2"
              placeholder="Repeat password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && <small style={{ color: "red" }}>{confirmPasswordError}</small>}

            <h3>Selecciona una foto de perfil:</h3>
            <div className="profile-pic-container">
              {profilePics.map((pic, index) => (
                <div
                  key={index}
                  className={`profile-pic-box ${
                    selectedProfilePic === pic ? "selected" : ""
                  }`}
                  onClick={() => setSelectedProfilePic(pic)}
                >
                  <img src={pic} alt={`Foto ${index + 1}`} className="profile-pic" />
                </div>
              ))}
            </div>
            {profilePicError && <small style={{ color: "red" }}>{profilePicError}</small>}

            <button type="submit">Envia</button>
          </form>
          <p>
            Ja tens un compte? <Link to="/">Inicia sessió aquí</Link>
          </p>
        </div>
      </div>
    </main>
  );
};
