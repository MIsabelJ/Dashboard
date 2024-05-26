import { IArticuloManufacturadoDetallePost } from "../ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost"
import { IImagenArticuloPost } from "../ImagenArticulo/IImagenArticuloPost"

export interface IArticuloManufacturadoPost {
    denominacion: string
    precioVenta: number
    descripcion: string
    tiempoEstimadoMinutos: number
    preparacion: string
    articuloManufacturadoDetalles: IArticuloManufacturadoDetallePost[]
    idImagenes: string[]
    idUnidadMedida: number
    idCategoria: number
}