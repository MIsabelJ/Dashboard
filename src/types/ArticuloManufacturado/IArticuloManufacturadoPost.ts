import { IArticuloManufacturadoDetallePost } from "../ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost"

export interface IArticuloManufacturadoPost{
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