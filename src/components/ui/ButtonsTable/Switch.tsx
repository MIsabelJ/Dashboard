import React from "react";
import { CircularProgress, Switch } from "@mui/material";

// -------------------- INTERFAZ --------------------
interface ISwitchButton {
  id: number;
  currentState: boolean;
  // route: string;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const SwitchButton = ({ currentState }: ISwitchButton) => {
  // -------------------- STATES --------------------
  const [active, setActive] = React.useState<boolean>(currentState);
  const [message, setMessage] = React.useState<string>(
    currentState ? "Activo" : "Inactivo"
  );
  const [loader, setLoader] = React.useState<boolean>(false);

  // -------------------- HANDLERS --------------------
  const handleClick = async () => {
    setLoader(true); // Activar el loader antes de las operaciones asincrónicas
    setMessage("");
    try {
      setActive(!active);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false); // Desactivar el loader después de las operaciones asincrónicas
    }
  };

  // -------------------- RENDER --------------------
  return (
    <div>
      {message}
      {loader ? (
        <CircularProgress />
      ) : (
        <Switch
          checked={active} // Utiliza el estado local 'active' para controlar el estado del Switch
          onChange={() => handleClick()}
        />
      )}
    </div>
  );
};
