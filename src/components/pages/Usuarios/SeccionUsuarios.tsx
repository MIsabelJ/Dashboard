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

const API_URL = import.meta.env.VITE_API_URL;

export const SeccionUsuarios = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<IUsuario[]>([]);
  //Maneja el elemento seleccionado en la tabla (para poder editarlo)
  const [selectedId, setSelectedId] = useState<number>();

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
      label: "Sucursal",
      key: "sucursal",
      // render: (usuario: IUsuario) => { // Cuando esté listo el endpoint, descomentar esto
      //   return <>{usuario.sucursal.nombre}</>;
      // },
    },
    {
      label: "Nombre",
      key: "name",
    },
    {
      label: "Rol",
      key: "rol",
      render: (usuario: IUsuario) => (
        <Select
          value={usuario.rol}
          onChange={(e) => {
            const updatedUsers = users.map((user: IUsuario) =>
              user.id === usuario.id ? { ...user, rol: e.target.value } : user
            );
            setUsers(updatedUsers);
            dispatch(setDataTable(updatedUsers));
          }}>
          {roles.map((rol) => (
            <MenuItem key={rol} value={rol}>
              {rol}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      label: "Estado",
      key: "eliminado",
      render: (usuario: IUsuario) =>
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
        // await usuarioService.delete(id).then(() => {
        //   getUsuario();
        // });
      }
    });
  };

  const getUsuario = async () => {
    // await usuarioService.getAll().then((usuarioData) => {
    //   dispatch(setDataTable(usuarioData));
    //   setLoading(false);
    // });
    const initialUsers: IUsuario[] = [
      {
        id: 1,
        name: "Juan Pérez",
        rol: "admin del negocio",
        sucursal: "Sucursal Centro",
        eliminado: false,
      },
      {
        id: 2,
        name: "María López",
        rol: "cajero",
        sucursal: "asdf",
        eliminado: false,
      },
      {
        id: 3,
        name: "Carlos Gómez",
        rol: "delivery",
        sucursal: "asdf",
        eliminado: false,
      },
    ];

    setUsers(initialUsers);
    dispatch(setDataTable(initialUsers));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getUsuario();
  }, []);

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
          <GenericTable<IUsuario>
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
