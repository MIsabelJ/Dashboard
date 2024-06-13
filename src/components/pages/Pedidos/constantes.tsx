import { IPedido } from "../../../types/Pedido/IPedido";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Link } from "@mui/material";
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

const API_URL = import.meta.env.VITE_API_URL;

const TriggerMenu = () => {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" {...bindTrigger(popupState)}>
            Dashboard
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={popupState.close}>Profile</MenuItem>
            <MenuItem onClick={popupState.close}>My account</MenuItem>
            <MenuItem onClick={popupState.close}>Logout</MenuItem>
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
    "en proceso",
    "terminados",
    "entregados",
    "en delivery",
    "facturados",
  ],
  //pueden ser objetos que traduzcan a los enums del back
  "admin del negocio": [
    "todos",
    "pendientes",
    "en proceso",
    "terminados",
    "entregados",
    "en delivery",
    "facturados",
  ],
  cajero: ["facturados", "todos"],
  cocinero: ["en proceso", "terminados"],
  repositor: ["pendientes", "en proceso"],
  delivery: ["en delivery", "entregados"],
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
    render: (pedido: IPedido) => TriggerMenu(),
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
    label: "Estado",
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
            underline="none"
          >
            <Button variant="contained" color="success">
              Descargar Factura
            </Button>
          </Link>
        );
      }
    },
  },
];
