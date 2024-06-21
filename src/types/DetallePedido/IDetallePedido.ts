import { IArticulo } from "../Articulo/IArticulo";
import { IPromocion } from "../Promocion/IPromocion";

export interface IDetallePedido {
    cantidad: number,
    subTotal: number,
    articulo?: IArticulo,
    promocion?: IPromocion
}