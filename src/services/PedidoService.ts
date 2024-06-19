import { IPedido } from "../types/Pedido/IPedido";
import { IPedidoPost } from "../types/Pedido/IPedidoPost";
import { BackendClient } from "./BackendClient";

export class PedidoService extends BackendClient<
  IPedido,
  IPedidoPost,
  IPedidoPost
> {
  async cancelarPedido(id: number, reponer: boolean) {
    //MODIFICAR CUANDO EL GABI TENGA EL ENDPOINT
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}/${id}/${reponer}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }
}
