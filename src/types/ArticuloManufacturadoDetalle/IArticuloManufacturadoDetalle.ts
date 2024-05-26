import { IArticuloInsumo } from "../ArticuloInsumo/IArticuloInsumo"
import { IBaseEntity } from "../IBaseEntity"

export interface IArticuloManufacturadoDetalle extends IBaseEntity{
    cantidad: number
    articuloInsumo: IArticuloInsumo
}