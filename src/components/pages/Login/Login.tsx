import { useNavigate } from "react-router-dom";
import "./login.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loginWithPopup, user, isAuthenticated } = useAuth0();

  const handleLogin = async () => {
    await loginWithPopup();
    if (isAuthenticated) {
      navigate("/empresa");
    }

    /* TODO: Redirección según rol Auth0 */
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <p className="title">Bienvenido</p>
        <form className="form" onSubmit={handleLogin}>
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
          {error && <p className="error">{error}</p>}
          <button type="submit" className="form-btn">
            Iniciar sesión
          </button>
        </form>
        <p className="sign-up-label">O</p>
        <div className="buttons-container">
          <button className="google-login-button" onClick={handleLogin}>
            <img src="/google.png" className="google-icon" alt="Google icon" />
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
