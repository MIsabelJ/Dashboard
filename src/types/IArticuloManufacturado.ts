import { IArticuloManufacturadoDetalle } from "./IArticuloManufacturadoDetalle"
import { IBaseEntity } from "./IBaseEntity"
import { IImagenArticulo } from "./IImagenArticulo"
import { IUnidadMedida } from "./IUnidadMedida"

export interface IArticuloManufacturado extends IBaseEntity {
    denominacion: string
    precioVenta: number
    descripcion: string
    tiempoEstimadoMinutos: number
    preparacion: string
    articuloManufacturadoDetalles: IArticuloManufacturadoDetalle[]
    imagenes: IImagenArticulo[]
    unidadMedida: IUnidadMedida
}