import React from "react";

import Switch from "@mui/material/Switch";
import { CircularProgress } from "@mui/material";


interface ISwitchButton {
  id: number;
  currentState: boolean;
  // route: string;
}

export const SwitchButton = ({ id, currentState }: ISwitchButton) => {
  const [active, setActive] = React.useState<boolean>(currentState);
  const [message, setMessage] = React.useState<string>(
    currentState ? "Activo" : "Inactivo"
  );
  const [loader, setLoader] = React.useState<boolean>(false);

  const handleClick = async () => {
    setLoader(true); // Activar el loader antes de las operaciones asincrónicas
    setMessage("");
    try {
      // genericService.logicDelete(id);
      console.log(active ? "Activado" : "Desactivado");
      setActive(!active);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false); // Desactivar el loader después de las operaciones asincrónicas
    }
  };
  return (
    <div>
      {message}
      {loader ? <CircularProgress /> : (
        <Switch
          checked={active} // Utiliza el estado local 'active' para controlar el estado del Switch
          onChange={() => handleClick()}
        />
      )}
    </div>
  );
};
