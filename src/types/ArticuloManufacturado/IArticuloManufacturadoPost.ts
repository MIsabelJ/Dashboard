import { IArticuloManufacturadoDetallePost } from "../ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost"
import { IImagen } from "../Imagen/IImagen"

export interface IArticuloManufacturadoPost {
    denominacion: string
    precioVenta: number
    descripcion: string
    tiempoEstimadoMinutos: number
    preparacion: string
    articuloManufacturadoDetalles: IArticuloManufacturadoDetallePost[]
    imagenes: IImagen[]
    idUnidadMedida: number
    idCategoria: number
}