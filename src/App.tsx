import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { useAuth0 } from "@auth0/auth0-react";
import { ObtainToken } from "./components/auth/ObtainToken";
import { useEffect } from "react";

function App() {
  const {isAuthenticated, getAccessTokenSilently, user: userAuth0 } = useAuth0();
  const getToken = async () => {
    const token = await ObtainToken(getAccessTokenSilently);
    localStorage.setItem("token", token);
  }
  useEffect(() => {
    if (isAuthenticated) {
      getToken();
      console.log("Se seteo en el localStorage");
    }else{
      localStorage.removeItem("token");
    }
  }, [isAuthenticated]);
  return (
      <AppRouter />
  );
}

export default App;
