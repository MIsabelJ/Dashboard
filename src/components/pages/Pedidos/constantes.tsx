import { IPedido } from "../../../types/Pedido/IPedido";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { PedidoService } from "../../../services/PedidoService";
import { IPedidoPost } from "../../../types/Pedido/IPedidoPost";
import { Link } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;
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
    // <h2>asdf</h2>
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" {...bindTrigger(popupState)}>
            estadoActual
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              className="menu-item"
              style={{ backgroundColor: "#FFEB3B" }}
              onClick={() => {
                popupState.close();
              }}>
              Pendiente
            </MenuItem>
            <MenuItem
              className="menu-item"
              style={{ backgroundColor: "#F44336" }}
              onClick={() => {
                popupState.close();
              }}>
              Cancelado
            </MenuItem>
            <MenuItem
              className="menu-item"
              style={{ backgroundColor: "#FF5722" }}
              onClick={() => {
                popupState.close();
              }}>
              Rechazado
            </MenuItem>
            <MenuItem
              className="menu-item"
              style={{ backgroundColor: "#4CAF50" }}
              onClick={() => {
                popupState.close();
              }}>
              Aprobado
            </MenuItem>
            <MenuItem
              className="menu-item"
              style={{ backgroundColor: "#2196F3" }}
              onClick={() => {
                popupState.close();
              }}>
              En proceso
            </MenuItem>

            <MenuItem
              className="menu-item"
              style={{ backgroundColor: "#8BC34A" }}
              onClick={() => {
                popupState.close();
              }}>
              Terminado
            </MenuItem>
            <MenuItem
              className="menu-item"
              style={{ backgroundColor: "#03A9F4" }}
              onClick={() => {
                popupState.close();
              }}>
              En delivery
            </MenuItem>
            <MenuItem
              className="menu-item"
              style={{ backgroundColor: "#9C27B0" }}
              onClick={() => {
                popupState.close();
              }}>
              Facturado
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
};
