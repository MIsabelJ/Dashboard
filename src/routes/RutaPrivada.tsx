import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { UsuarioService } from "../services/UsuarioService";
import { EmpleadoService } from "../services/EmpleadoService";
import { IEmpleado } from "../types/Empleado/IEmpleado";

interface RutaPrivadaProps {
  children: ReactNode;
  rolesPermitidos: string[];
}

const API_URL = import.meta.env.VITE_API_URL;

export const RutaPrivada = ({
  children,
  rolesPermitidos,
}: RutaPrivadaProps) => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [usuarioRoles, setUsuarioRoles] = useState<String>();
  const [isLoading, setIsLoading] = useState(true);
  const VITE_AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
  const empleadoService = new EmpleadoService(`${API_URL}/empleado`);

  useEffect(() => {
    const obtenerRoles = async () => {
      const user = localStorage.getItem("user");
      setIsLoading(true);
      try {
        if (user) {
          const empleado: IEmpleado | null = await empleadoService.getById(
            Number(user)
          );
          if (empleado) {
            setUsuarioRoles(empleado.tipoEmpleado);
          } else {
            console.log("No se encontro el usuario");
          }
        }
        setIsLoading(false);
      } catch {
        console.log("No existe un usuario en el almacenamiento local");
      }
    };

    if (isAuthenticated) {
      obtenerRoles();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, getIdTokenClaims, VITE_AUTH0_AUDIENCE]);

  if (isLoading) {
    return <div>Cargando...</div>; // O cualquier indicador de carga que prefieras
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const tieneAcceso = rolesPermitidos.some((rolPermitido) => {
    if (usuarioRoles) {
      return usuarioRoles.includes(rolPermitido.toUpperCase());
    }
    return false;
  });

  return tieneAcceso ? children : <Navigate to="/unauthorized" />;
};
