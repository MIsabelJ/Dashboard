import { IArticuloInsumo } from "./IArticuloInsumo"
import { IBaseEntity } from "./IBaseEntity"

export interface IArticuloManufacturadoDetalle extends IBaseEntity{
    cantidad:number
    articuloInsumo:IArticuloInsumo  
}