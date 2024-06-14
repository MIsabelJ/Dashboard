import { Button, Link } from "@mui/material";
import { IPedido } from "../../../types/Pedido/IPedido";

const API_URL = import.meta.env.VITE_API_URL;

export const roles: Record<string, string[]> = {
  admin: [
    "TODOS",
    "PENDIENTE",
    "RECHAZADO",
    "CANCELADO",
    "APROBADO",
    "PREPARACION",
    "TERMINADO",
    "DELIVERY",
    "FACTURADO",
  ],
  "admin del negocio": [
    "TODOS",
    "PENDIENTE",
    "RECHAZADO",
    "CANCELADO",
    "APROBADO",
    "PREPARACION",
    "TERMINADO",
    "DELIVERY",
    "FACTURADO",
  ],
  cajero: [
    "TODOS",
    "PENDIENTE",
    "RECHAZADO",
    "CANCELADO",
    "APROBADO",
    "PREPARACION",
    "TERMINADO",
    "DELIVERY",
    "FACTURADO",
  ],
  cocinero: ["APROBADO", "PREPARACION", "TERMINADO"],
  // repositor: ["PENDIENTE", "preparacion"], //No tiene ningún permiso
  delivery: ["TERMINADO", "DELIVERY", "FACTURADO"],
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
    render: (pedido: IPedido) => `${pedido.estado.toLowerCase()}`,
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
