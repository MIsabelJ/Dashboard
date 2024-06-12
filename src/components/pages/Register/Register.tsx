import { useNavigate } from "react-router-dom";
import "./login.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // const handleRegister = (e) => {
  //   e.preventDefault();
  //   if (password !== confirmPassword) {
  //     setError("Las contraseñas no coinciden");
  //   } else {
  //     // Lógica de registro
  //     setError("");
  //     console.log("Registro exitoso");
  //   }
  // };

  const navigate = useNavigate();
  const { loginWithPopup, isAuthenticated } = useAuth0();

  const handleRegister = async () => {
    await loginWithPopup({
      connection: "google-oauth2",
    });
    if (isAuthenticated) {
      navigate("/empresa");
    }

    /* TODO: Redirección según rol Auth0 */
    // ESTA LÓGICA NO ES CORRECTA, ESTA ES PARA REDIRECCIONAR MOSTRÁNDONOS 3 PÁGINAS DE LOGIN DISTINTAS
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <p className="title">Bienvenido</p>
        <form className="form" onSubmit={handleRegister}>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="Repetir Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="form-btn">
            Registrarse
          </button>
        </form>
        <p className="sign-up-label">O</p>
        <div className="buttons-container">
          <button className="google-login-button" onClick={handleRegister}>
            <img src="/google.png" className="google-icon" alt="Google icon" />
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default Register;
