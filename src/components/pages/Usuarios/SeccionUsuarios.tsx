import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import GenericTable from "../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../ui/Loader/Loader";
import Swal from "sweetalert2";
import { IUsuario } from "../../../types/Usuario/IUsuario";
import { MenuItem, Select } from "@mui/material";
import ModalUsuario from "../../ui/modals/ModalUsuario/ModalUsuario";
import { SucursalService } from "../../../services/SucursalService";
import { IEmpleado } from "../../../types/Empleado/IEmpleado";
import { EmpleadoService } from "../../../services/EmpleadoService";

const API_URL = import.meta.env.VITE_API_URL;

export const SeccionUsuarios = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<IEmpleado[]>([]);
  //Maneja el elemento seleccionado en la tabla (para poder editarlo)
  const [selectedId, setSelectedId] = useState<number>();

  const empleadoService = new EmpleadoService(API_URL + "/empleado");
  const sucursalService = new SucursalService(API_URL + "/sucursal");
  const dispatch = useAppDispatch();

  const roles = [
    "admin",
    "admin del negocio",
    "cajero",
    "cocinero",
    "repositor",
    "delivery",
  ];

  const ColumnsUsuario = [
    {
      label: "Nombre",
      key: "nombre",
    },
    {
      label: "Apellido",
      key: "apellido",
    },
    {
      label: "Rol",
      key: "tipoEmpleado",
    },
    {
      label: "Estado",
      key: "eliminado",
      render: (usuario: IEmpleado) =>
        usuario.eliminado ? "Eliminado" : "Activo",
    },
  ];

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres eliminar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await empleadoService.delete(id).then(() => {
          getUsuario();
        })
      }
    });
  };

  const getUsuario = async () => {
    await empleadoService.getAll().then((usuarioData) => {
      dispatch(setDataTable(usuarioData));
      setUsers(usuarioData);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getUsuario();
  }, []);

  useEffect(() => {
    if (!openModal) {
      setSelectedId(undefined);
    }
  }, [openModal]);

  return (
    <>
      <div>
        <div
          style={{
            padding: ".4rem",
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
          }}></div>
        {/* Mostrar indicador de carga mientras se cargan los datos */}
        {loading ? (
          <Loader />
        ) : (
          // Mostrar la tabla de personas una vez que los datos se han cargado
          <GenericTable<IEmpleado>
            handleDelete={handleDelete}
            columns={ColumnsUsuario}
            setOpenModal={setOpenModal}
            setSelectedId={setSelectedId}
          />
        )}
      </div>
      <ModalUsuario
        show={openModal}
        handleClose={() => setOpenModal(false)}
        selectedId={selectedId}
      />
    </>
  );
};
