import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { useAppDispatch } from "../../../hooks/redux";
import { IPedido } from "../../../types/Pedido/IPedido";
import { PedidoService } from "../../../services/PedidoService";
import GenericTable from "../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../ui/Loader/Loader";
import { Button, ButtonGroup } from "@mui/material";
import { PedidoModal } from "../../ui/modals/ModalPedidos/ModalPedido";
import { roles, ColumnsPedido } from "./constantes";
import { EmpleadoService } from "../../../services/EmpleadoService";

const API_URL = import.meta.env.VITE_API_URL;

export const SeccionPedidos = () => {
  // -------------------- STATES --------------------
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  //Maneja el elemento seleccionado en la tabla (para poder editarlo)
  const [selectedId, setSelectedId] = useState<number>();
  const [userRole, setUserRole] = useState("ADMIN");
  //Permite filtrar los pedidos por su estado
  const [filtro, setFiltro] = useState("");
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  // -------------------- SERVICES --------------------
  const pedidoService = new PedidoService(API_URL + "/pedido");
  const dispatch = useAppDispatch();
  const empleadoService = new EmpleadoService(API_URL + "/empleado");

  // -------------------- HANDLERS --------------------

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres cambiar el estado?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Adelante!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await pedidoService.delete(id).then(() => {
          getPedido();
        });
      }
    });
  };

  const handleFiltro = (filtro: string) => {
    setFiltro(filtro);
    if (filtro != "TODOS") {
      const filtered = pedidos.filter((pedido) => pedido.estado == filtro);
      dispatch(setDataTable(filtered));
    } else {
      dispatch(setDataTable(pedidos));
    }
  };

  // -------------------- FUNCIONES --------------------

  const getPedido = async () => {
    await pedidoService.getAll().then((pedidoData) => {
      setPedidos(pedidoData);
      dispatch(setDataTable(pedidoData));
      setLoading(false);
      console.log(pedidoData);
    });
  };

  const getUser = async () => {
    const empleado = await empleadoService.getById(
      Number(localStorage.getItem("user"))
    );
    if (empleado) {
      setUserRole(empleado.tipoEmpleado);
    } else {
      console.log("No se encontro el usuario");
    }
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    setLoading(true);
    getUser();
    console.log(userRole);
    setFiltro(roles[userRole][0]);
    getPedido();
  }, []);

  useEffect(() => {
    if (!openModal) {
      setFiltro("TODOS");
      getPedido();
    }
  }, [openModal]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="seccion-container">
          <div style={{ alignSelf: "center" }}>
            <ButtonGroup variant="outlined" aria-label="filtros button group">
              {roles[userRole].map((option) => (
                <Button
                  key={option}
                  variant={filtro === option ? "contained" : "outlined"}
                  onClick={() => handleFiltro(option)}
                  className={filtro === option ? "filtro-activo" : ""}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div style={{ height: "85vh" }}>
            <GenericTable<IPedido>
              setSelectedId={setSelectedId}
              handleDelete={handleDelete}
              columns={ColumnsPedido}
              setOpenModal={setOpenModal}
            />
          </div>
        </div>
      )}
      <PedidoModal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        selectedId={selectedId}
        role={userRole}
      />
    </>
  );
};
