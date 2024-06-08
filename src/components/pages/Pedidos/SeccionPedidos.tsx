import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { useAppDispatch } from "../../../hooks/redux";
import { IPedido } from "../../../types/Pedido/IPedido";
import { PedidoService } from "../../../services/PedidoService";
// import ModalPedido from "../../ui/modals/ModalPedidos/ModalPedido";
import GenericTable from "../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../ui/Loader/Loader";

const API_URL = import.meta.env.VITE_API_URL;

export const SeccionPedidos = () => {
  // -------------------- STATES --------------------
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  //Maneja el elemento seleccionado en la tabla (para poder editarlo)
  const [selectedId, setSelectedId] = useState<number>();

  // -------------------- SERVICES --------------------
  const pedidoService = new PedidoService(API_URL + "/pedido");
  const dispatch = useAppDispatch();

  // -------------------- COLUMNAS --------------------
  const ColumnsPedido = [
    {
      label: "Cliente",
      key: "cliente",
      render: (pedido: IPedido) => (
        <p>{pedido.cliente?.nombre + " " + pedido.cliente?.apellido}</p>
      ),
    },
    {
      label: "Detalle",
      key: "detallePedidos",
      render: (pedido: IPedido) => (
        <ul>
          {pedido.detallePedidos.map((detalle, index) => (
            <li key={index}>
              {detalle.articulo.denominacion}: {detalle.cantidad}{" "}
            </li>
          ))}
        </ul>
      ),
    },
    { label: "Total", key: "total" },
    { label: "Costo total", key: "totalCosto" },
    {
      label: "Status",
      key: "estado",
      render: (pedido: IPedido) => {
        switch (pedido?.estado) {
          case "PREPARACION":
            return "Preparación";
          case "PENDIENTE":
            return "Pendiente";
          case "CANCELADO":
            return "Cancelado";
          case "RECHAZADO":
            return "Rechazado";
          case "ENTREGADO":
            return "Entregado";
          default:
            return "Activo";
        }
      },
    },
    {
      label: "Entrega",
      key: "tipoEnvio",
      render: (pedido: IPedido) => (
        <>{pedido?.tipoEnvio === "Delivery" ? "Delivery" : "Takeaway"}</>
      ),
    },
    {
      label: "Forma de Pago",
      key: "formaPago",
      render: (pedido: IPedido) => (
        <>{pedido?.formaPago == "EFECTIVO" ? "Efectivo" : "Mercado"}</>
      ),
    },
    { label: "Fecha de Pedido", key: "fechaPedido" },
    { label: "Hora de Pedido", key: "horaEstimadaFinalizacion" },
    {
      label: "Domicilio",
      key: "domicilio.calle",
      render: (pedido: IPedido) => (
        <p>{pedido.domicilio?.calle + " " + pedido.domicilio?.numero}</p>
      ),
    },
    {
      label: "Estado",
      key: "eliminado",
      render: (pedido: IPedido) => (pedido.eliminado ? "Eliminado" : "Activo"),
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

  // -------------------- FUNCIONES --------------------

  const getPedido = async () => {
    await pedidoService.getAll().then((pedidoData) => {
      dispatch(setDataTable(pedidoData));
      setLoading(false);
    });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    setLoading(true);
    getPedido();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ height: "85vh" }}>
          <GenericTable<IPedido>
            setSelectedId={setSelectedId}
            handleDelete={handleDelete}
            columns={ColumnsPedido}
            setOpenModal={setOpenModal}
          />
        </div>
      )}
      {/* <ModalPedido
        selectedId={selectedId}
        show={openModal}
        handleClose={() => {
          setOpenModal(false);
          setSelectedId(undefined);
        }}
      /> */}
    </>
  );
};
