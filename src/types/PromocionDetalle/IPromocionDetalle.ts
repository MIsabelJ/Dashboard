import { IArticulo } from "../Articulo/IArticulo";
import { IBaseEntity } from "../IBaseEntity";

export interface IPromocionDetalle extends IBaseEntity {
    cantidad: number
    articulo: IArticulo // TODO: Ver cómo resolverlo
}