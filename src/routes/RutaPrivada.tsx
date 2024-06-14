import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface RutaPrivadaProps {
  children: ReactNode;
  rolesPermitidos: string[];
}

export const RutaPrivada = ({
  children,
  rolesPermitidos,
}: RutaPrivadaProps) => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [usuarioRoles, setUsuarioRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const VITE_AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

  useEffect(() => {
    const obtenerRoles = async () => {
      try {
        const claims = await getIdTokenClaims();
        console.log("Claims obtenidos:", claims); // Debug: Imprime los claims
        if (claims && claims[VITE_AUTH0_AUDIENCE + "/roles"]) {
          setUsuarioRoles(claims[VITE_AUTH0_AUDIENCE + "/roles"]);
        }
      } catch (error) {
        console.error("Error obteniendo los roles:", error);
      } finally {
        setIsLoading(false);
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

  const tieneAcceso = rolesPermitidos.some((rolPermitido) =>
    usuarioRoles.includes(rolPermitido.toUpperCase())
  );

  console.log("Autenticado:", isAuthenticated);
  console.log("Tiene acceso:", tieneAcceso);
  console.log("Usuario roles:", usuarioRoles);
  console.log("Roles permitidos:", rolesPermitidos);

  return tieneAcceso ? children : <Navigate to="/unauthorized" />;
};
