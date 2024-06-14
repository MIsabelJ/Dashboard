import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { IPedido } from "../../../types/Pedido/IPedido";
import { PedidoService } from "../../../services/PedidoService";
// import ModalPedido from "../../ui/modals/ModalPedidos/ModalPedido";
import GenericTable from "../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../ui/Loader/Loader";
import { Button, ButtonGroup, Link } from "@mui/material";
import { PedidoModal } from "../../ui/modals/ModalPedidos/ModalPedido";

const API_URL = import.meta.env.VITE_API_URL;

export const SeccionPedidos = () => {
  // -------------------- STATES --------------------
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  //Maneja el elemento seleccionado en la tabla (para poder editarlo)
  const [selectedId, setSelectedId] = useState<number>();
  const [userRole, setUserRole] = useState("cajero");
  //Permite filtrar los pedidos por su estado
  const [filtro, setFiltro] = useState("");

  // -------------------- SERVICES --------------------
  const pedidoService = new PedidoService(API_URL + "/pedido");
  const dispatch = useAppDispatch();

  const pedidoActive = useAppSelector((state) => state.tableReducer.dataTable);

  const roles: Record<string, string[]> = {
    admin: [
      "todos",
      "pendientes",
      "rechazados",
      "cancelados",
      "aprobados",
      "en proceso",
      "terminados",
      "en delivery",
      "facturados",
    ],
    //pueden ser objetos que traduzcan a los enums del back
    "admin del negocio": [
      "todos",
      "pendientes",
      "rechazados",
      "cancelados",
      "aprobados",
      "en proceso",
      "terminados",
      "en delivery",
      "facturados",
    ],
    cajero: [
      "todos",
      "pendientes",
      "rechazados",
      "cancelados",
      "aprobados",
      "en proceso",
      "terminados",
      "en delivery",
      "facturados",
    ],
    cocinero: ["aprobados", "en proceso", "terminados"],
    // repositor: ["pendientes", "en proceso"], //No tiene ningún permiso
    delivery: ["en delivery", "facturados"],
  };

  // -------------------- COLUMNAS --------------------
  const ColumnsPedido = [
    {
      label: "Cliente",
      key: "cliente",
      render: (pedido: IPedido) =>
        `${pedido.cliente?.nombre + " " + pedido.cliente?.apellido}`,
    },
    {
      label: "Detalle",
      key: "detallePedidos",
      render: (pedido: IPedido) =>
        pedido.detallePedidos
          .map(
            (detalle) =>
              `\u2022 ${detalle.articulo.denominacion}: ${detalle.cantidad}`
          )
          .join("\n"),
    },
    { label: "Total", key: "total" },
    {
      label: "Status",
      key: "estado",
      render: (pedido: IPedido) => `${pedido.estado}`,
    },
    {
      label: "Entrega",
      key: "tipoEnvio",
      render: (pedido: IPedido) =>
        `${pedido?.tipoEnvio === "Delivery" ? "Delivery" : "Takeaway"}`,
    },
    {
      label: "Forma de Pago",
      key: "formaPago",
      render: (pedido: IPedido) =>
        `${pedido?.formaPago == "EFECTIVO" ? "Efectivo" : "Mercado"}`,
    },
    { label: "Fecha de Pedido", key: "fechaPedido" },
    { label: "Hora de Pedido", key: "horaEstimadaFinalizacion" },
    {
      label: "Domicilio",
      key: "domicilio.calle",
      render: (pedido: IPedido) =>
        `${pedido.domicilio?.calle + " " + pedido.domicilio?.numero}`,
    },
    {
      label: "Estado", //TODO: CAMBIAR POR ACCIONES
      key: "eliminado",
      render: (pedido: IPedido) => (pedido.eliminado ? "Eliminado" : "Activo"),
    },
    {
      label: "Factura",
      key: "factura",
      render: (pedido: IPedido) => {
        if (pedido.factura) {
          return (
            <Link
              href={`${API_URL}/pedido/downloadFacturaPedido/${pedido.id}`}
              target="_blank"
              underline="none">
              <Button variant="contained" color="success">
                Descargar Factura
              </Button>
            </Link>
          );
        }
      },
    },
  ];

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

  const handleFiltro = (filtro: React.SetStateAction<string>) => {
    setFiltro(filtro);
    console.log(filtro);
    console.log(pedidoActive);
    if (filtro == "todos") {
      dispatch(setDataTable(pedidoActive));
    } else {
      dispatch(
        setDataTable(pedidoActive.filter((pedido) => pedido.estado === filtro))
      );
    }
  };

  // -------------------- FUNCIONES --------------------

  const getPedido = async () => {
    await pedidoService.getAll().then((pedidoData) => {
      console.log(pedidoData);
      dispatch(setDataTable(pedidoData));
      setLoading(false);
    });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    setLoading(true);
    setUserRole("admin"); //TODO: Esto está hardcodeado, hay que ver como obtener el rol
    if (filtro == "todos") {
      setFiltro("");
    } else {
      setFiltro(roles[userRole][0]);
    }
    getPedido();
  }, []);

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
              // editable={false}
            />
          </div>
        </div>
      )}
      <PedidoModal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        selectedId={selectedId}
      />
    </>
  );
};
