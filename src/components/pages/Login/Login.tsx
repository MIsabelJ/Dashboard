import { useNavigate } from "react-router-dom";
import "./login.css";
import LoginButton from "../../ui/LoginButtons/LoginButton";
import RegisterButton from "../../ui/LoginButtons/RegisterButton";
import { Logout } from "@mui/icons-material";
import LogoutButton from "../../ui/LoginButtons/LogoutButton";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import { EmpleadoService } from "../../../services/EmpleadoService";
import { IEmpleado } from "../../../types/Empleado/IEmpleado";

const API_URL = import.meta.env.VITE_API_URL;
const Login = () => {
  const navigate = useNavigate();
  const empleadoService = new EmpleadoService(`${API_URL}/empleado`);
  const [rolEmpleado, setRolEmpleado] = useState<String>();
  const [empleado, setEmpleado] = useState<IEmpleado | null>(null);
  const { isAuthenticated } = useAuth0();

  const getEmpleado = async () => {
    const idEmpleadoString = localStorage.getItem("user");
    if (!idEmpleadoString) {
      console.error("No se pudo obtener el id del empleado del localStorage");
      return;
    }
    const idEmpleado = Number(idEmpleadoString);
    if (isNaN(idEmpleado)) {
      console.error("El id del empleado en el localStorage no es un número válido");
      return;
    }
    const empleado: IEmpleado | null = await empleadoService.getById(idEmpleado);
    if (empleado) {
      setEmpleado(empleado);
      setRolEmpleado(empleado.tipoEmpleado.toString());
      console.log("EMPLEADO: ", empleado);
    } else {
      console.error("No se pudo obtener el empleado con el id proporcionado");
    }
  };

  const setStorage = (route: string) => {
    if (empleado && empleado.sucursal) {
      const idSucursal = empleado.sucursal.id;
      const idEmpresa = empleado.sucursal.empresa.id;
      localStorage.setItem("sucursalId", idSucursal.toString());
      localStorage.setItem("empresaId", idEmpresa.toString());
      navigate(route);
    } else {
      console.error("Información de sucursal o empresa incompleta");
    }

  }
  const handleLogin = () => {
    if (!rolEmpleado || !empleado) {
      console.error("No se ha obtenido la información del empleado");
      return;
    }

    switch (rolEmpleado) {
      case "ADMIN":
        navigate('/empresa');
        break;
      case "ADMIN_NEGOCIO":
        setStorage('/inicio');
        break;
      case "CAJERO":
        setStorage('/pedido');
        break;
      case "COCINERO":
        setStorage('/articulo-manufacturado');
        break;
      case "REPOSITOR":
        setStorage('/articulo-manufacturado');
        break;
      case "DELIVERY":
        setStorage('/pedido');
        break;
      default:
        console.error("Rol de empleado desconocido");
        break;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const checkLocalStorage = async () => {
        while (!localStorage.getItem("user")) {
          await new Promise(resolve => setTimeout(resolve, 100)); // Espera 100 ms antes de volver a comprobar
        }
        getEmpleado();
      };
      checkLocalStorage();
    }
  }, [isAuthenticated]);

  return (
    <div className="page-container">
      <div className="form-container" >
        {isAuthenticated ? <p className="title">Bienvenido/a</p> : <p className="title">Iniciar Sesion</p>}
        {!isAuthenticated &&
          <form className="form">
            <LoginButton />
          </form>
        }
        {isAuthenticated && (
          <div>
            <p>{empleado?.nombre} {empleado?.apellido}.</p>
            <Button onClick={handleLogin}>Ingresar</Button>
          </div>
        )
        }
      </div>
    </div>
  );
};

export default Login;
