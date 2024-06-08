import { IArticulo } from "../Articulo/IArticulo";

export interface IDetallePedido {
    cantidad: number,
    subTotal: number,
    articulo: IArticulo
}