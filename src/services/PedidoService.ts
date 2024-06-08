import { IPedido } from "../types/Pedido/IPedido";
import { IPedidoPost } from "../types/Pedido/IPedidoPost";
import { BackendClient } from "./BackendClient";

export class PedidoService extends BackendClient<IPedido, IPedidoPost, IPedidoPost> { }