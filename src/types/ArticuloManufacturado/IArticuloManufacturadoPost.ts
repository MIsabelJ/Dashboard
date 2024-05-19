import { IArticuloManufacturadoDetalle } from "../ArticuloManufacturadoDetalle/IArticuloManufacturadoDetalle"
import { IImagenArticulo } from "../ImagenArticulo/IImagenArticulo"
import { IUnidadMedida } from "../UnidadMedida/IUnidadMedida"

export interface IArticuloManufacturadoPost{
    denominacion: string
    precioVenta: number
    descripcion: string
    tiempoEstimadoMinutos: number
    preparacion: string
    idArticuloManufacturadoDetalles: number[]
    idImagenes: number[]
    idUnidadMedida: number
    idCategoria: number
}