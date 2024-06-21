import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Navigate } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { User, useAuth0 } from "@auth0/auth0-react";
import { ObtainToken } from "./components/auth/ObtainToken";
import { useEffect } from "react";
import { UsuarioService } from "./services/UsuarioService";
import { IUsuario } from "./types/Usuario/IUsuario";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const {isAuthenticated, getAccessTokenSilently, user: userAuth0 } = useAuth0();
  const usuarioService = new UsuarioService(`${API_URL}/empleado`)
  const getToken = async () => {
    const token = await ObtainToken(getAccessTokenSilently);
    localStorage.setItem("token", token);
  }
  const getUser = async () =>{
    if (userAuth0?.email){
      await getToken()
      console.log("Email ", userAuth0.email)
      const usuario= await usuarioService.getByEmail(userAuth0?.email);
      if (usuario){
        localStorage.setItem("user", String(usuario.id))
      }else{
        console.log("No se encontro el usuario")
      }
    }else{
      return null;
    }
    
  }
  useEffect(() => {
    if (isAuthenticated) {
      getUser();
    }else{
      localStorage.removeItem("token");
      localStorage.removeItem("user")
    }
  }, [isAuthenticated]);
  return (
      <AppRouter />
  );
}

export default App;
