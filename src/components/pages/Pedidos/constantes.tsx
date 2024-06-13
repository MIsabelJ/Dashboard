import { IPedido } from "../../../types/Pedido/IPedido";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { PedidoService } from "../../../services/PedidoService";
import { IPedidoPost } from "../../../types/Pedido/IPedidoPost";
/*
PREPARACION,
PENDIENTE,
TERMINADO,
FACTURADO,
CANCELADO,
RECHAZADO,
DELIVERY,
APROBADO
*/

// .estado-pendientes {
//   background-color: #FFEB3B;
// }

// .estado-cancelado {
//   background-color: #F44336;
// }

// .estado-rechazado {
//   background-color: #FF5722;
// }

// .estado-aprobado {
//   background-color: #4CAF50;
// }

// .estado-en-proceso {
//   background-color: #2196F3;
// }

// .estado-terminado {
//   background-color: #8BC34A;
// }

// .estado-en-delivery {
//   background-color: #03A9F4;
// }

// .estado-facturado {
//   background-color: #9C27B0;
// }
const estados = [
  {
    nombre: "Pendiente",

    color: "#FFEB3B",
  },
  {
    nombre: "Cancelado",
    color: "#F44336",
  },
  {
    nombre: "Rechazado",
    color: "#FF5722",
  },
  {
    nombre: "Aprobado",
    color: "#4CAF50",
  },
  {
    nombre: "En proceso",
    color: "#2196F3",
  },
  {
    nombre: "Terminado",
    color: "#8BC34A",
  },
  {
    nombre: "En delivery",
    color: "#03A9F4",
  },
  {
    nombre: "Facturado",
    color: "#9C27B0",
  },
];
const TriggerMenu = (pedido: IPedido) => {
  const [estadoActual, setEstadoActual] = React.useState<string>(pedido.estado);
  const [loading, setLoading] = React.useState<boolean>(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const pedidoService = new PedidoService(API_URL + "/pedido");

  React.useEffect(() => {
    if (estadoActual === pedido.estado) {
      setLoading(true);
      const pedidoPost: IPedidoPost = {
        ...pedido,
        estado: estadoActual,
        detallePedidos: pedido.detallePedidos.map((detalle) => ({
          cantidad: detalle.cantidad,
          subTotal: detalle.subTotal,
          idArticulo: detalle.articulo.id,
        })),
        idDomicilio: pedido.domicilio.id,
        idSucursal: pedido.sucursal.id,
        idCliente: pedido.cliente.id ?? 0,
        idEmpleado: pedido.empleado.id,
      };
      if (estadoActual == "Facturado") {
        // TODO: GENERAR FACTURA
      }
      const update = async () => {
        await pedidoService.put(pedido.id, pedidoPost);
      };
      update();
      setLoading(false);
    }
  }, [estadoActual]);

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" {...bindTrigger(popupState)}>
            {loading ? "..." : estadoActual}
          </Button>
          <Menu {...bindMenu(popupState)}>
            {estados.map((estado) => (
              <MenuItem
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: estado.color,
                }}
                onClick={() => {
                  setEstadoActual(estado.nombre);
                  popupState.close();
                }}>
                {estado.nombre}
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
};

export const roles: Record<string, string[]> = {
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
export const ColumnsPedido = [
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
    render: (pedido: IPedido) => TriggerMenu(pedido),
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
    render: (pedido: IPedido) => {
      if (pedido.estado == "facturado") {
        return <Button variant="contained">Generar Factura</Button>; //TODO: PONER ONCLICK GENERADOR DE FACTURA ACÁ
      }
      return pedido.eliminado ? "Eliminado" : "Activo";
    },
  },
];
