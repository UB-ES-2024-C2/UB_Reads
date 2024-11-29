import "./styles/signup.css";
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { signup } from "./services/UserService.js"
import { Link, useNavigate } from "react-router-dom";

export const SignupForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const [uNameError, setUnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateUname = (username) => {
    if (username.length > 250) {
      return "El username no pot superar els 250 caràcters."
    }
    return "";
  }

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
    // Final validation before submitting
    const uNameErorrMsg = validateUname(username);
    const emailErrorMsg = validateEmail(email);
    const passwordErrorMsg = validatePassword(password);
    const confirmPasswordErrorMsg = validateConfirmPassword(password, confirmPassword);

    if (!emailErrorMsg && !passwordErrorMsg && !confirmPasswordErrorMsg) {
      // Submit form logic (e.g., send data to server)
      const response = await signup(username, email, password)
      if (response.ok) {
        // Redirect to the login page or home after successful signup
        navigate("/");
    } else {
        const errorData = await response.json();
        alert(errorData.message || "Error during registration. Please try again.");
    }
      //navigate("/home");
    } else {
      setUnameError(uNameErorrMsg);
      setEmailError(emailErrorMsg);
      setPasswordError(passwordErrorMsg);
      setConfirmPasswordError(confirmPasswordErrorMsg);
    }
  };

  const handleUnameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setUnameError(validateUname(value));
  }

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(validateConfirmPassword(password, value));
  };

  return (
    <main className="main-container">
      <div className="central-container">
        <div className="welcome-container">
          <h2>Benvingut a UBReads!</h2>
          <p>
            Ens alegrem de tenir-te aquí. Siusplau, crea un nou compte per poder accedir a <b>UB Reads</b>.
          </p>
        </div>
        <div className="signup-container">
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Nom d&#39;usuari:</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              required
              value={username}
              onChange={handleUnameChange}
            />
            {uNameError && <small style={{ color: "red" }}>{uNameError}</small>}

            <label htmlFor="email">Introdueix un Email</label>
            <input
              type="email"
              id="email"
              placeholder="example@example.com"
              required
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <small style={{ color: "red" }}>{emailError}</small>}

            <label htmlFor="password">Contrasenya:</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <small style={{ color: "red" }}>{passwordError}</small>}

            <label htmlFor="password2">Repeteix la contrasenya:</label>
            <input
              type="password"
              id="password2"
              placeholder="Repeat password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {confirmPasswordError && <small style={{ color: "red" }}>{confirmPasswordError}</small>}

            <button type="submit">Envia</button>
          </form>
          <p>
            Ja tens un compte? <Link to="/">Logueja&#39;t aquí</Link>
          </p>
        </div>
      </div>
    </main>
  );
};