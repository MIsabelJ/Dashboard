import { useNavigate } from "react-router-dom";
import "./login.css";
import LoginButton from "../../ui/LoginButtons/LoginButton";
import RegisterButton from "../../ui/LoginButtons/RegisterButton";
import { Logout } from "@mui/icons-material";
import LogoutButton from "../../ui/LoginButtons/LogoutButton";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    navigate("/empresa"); {/* TODO: Redirección según rol Auth0 */}
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <p className="title">Bienvenido</p>
        <form className="form">
          {/* <input type="email" className="input" placeholder="Email" />
          <input type="password" className="input" placeholder="Contraseña" /> */}
          <LoginButton/>
          <LogoutButton/>
        </form>
        <p className="sign-up-label">O</p>
        <div className="buttons-container">
          <button className="google-login-button" onClick={handleLogin}> {/* TODO: Redirección a Google con Auth0 */}
            <img src="/google.png" className="google-icon" alt="Google icon" />
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
