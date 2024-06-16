import { IPedido } from "../types/Pedido/IPedido";
import { IPedidoPost } from "../types/Pedido/IPedidoPost";
import { BackendClient } from "./BackendClient";

export class PedidoService extends BackendClient<
  IPedido,
  IPedidoPost,
  IPedidoPost
> {
  async cancelarPedido(id: number, pedido: IPedidoPost, reponer: boolean) {
    //MODIFICAR CUANDO EL GABI TENGA EL ENDPOINT
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}/${id}?reponer=${reponer}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pedido),
    });
    return await response.json();
  }
}
