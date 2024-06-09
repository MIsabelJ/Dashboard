import { IPedido } from "../../../types/Pedido/IPedido";

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
    render: (pedido: IPedido) => {
      switch (pedido?.estado) {
        case "PENDIENTE":
          return "Pendiente";
        case "PREPARACION":
          return "Preparación";
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
];