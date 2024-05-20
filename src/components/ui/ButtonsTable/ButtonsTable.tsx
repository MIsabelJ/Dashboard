import { useAppDispatch } from "../../../hooks/redux";
import { setElementActive } from "../../../redux/slices/TablaReducer";

import { Button, Icon, IconButton } from "@mui/material";
import { DeleteRounded, Edit, EditAttributes, EditAttributesRounded, EditNotifications, EditRounded } from "@mui/icons-material";

// Define una interfaz genérica para los props del componente
interface IButtonsTable<T> {
  el: T; // Elemento de cualquier tipo,
  handleDelete: (id: number) => void; // Función para manejar la eliminación de un elemento
  setOpenModal: (state: boolean) => void; // Función para manejar la eliminación de un elemento
}

export const ButtonsTable = <T extends { id: number }>({
  el,
  handleDelete,
  setOpenModal,
}: IButtonsTable<T>) => {
  const dispatch = useAppDispatch();

  // Función para manejar la selección del modal para editar
  const handleModalSelected = () => {
    // Establecer el elemento activo en el estado
    dispatch(setElementActive({ element: el }));
    // Mostrar el modal para editar el elemento
    setOpenModal(true);
  };

  // Función para manejar la eliminación de un elemento
  // const handleDeleteItem = () => {
  //   handleDelete(el.id); // Llamar a la función handleDelete con el ID del elemento
  // };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {/* Botón para editar el elemento */}
      <IconButton onClick={handleModalSelected} color="primary">
        <EditRounded />
      </IconButton>
      <IconButton onClick={() => handleDelete(el.id)} color="error">
        <DeleteRounded />
      </IconButton>
    </div>
  );
};