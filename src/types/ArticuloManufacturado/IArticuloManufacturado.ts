import { IArticuloManufacturadoDetalle } from "../ArticuloManufacturadoDetalle/IArticuloManufacturadoDetalle"
import { ICategoria } from "../Categoria/ICategoria"
import { IBaseEntity } from "../IBaseEntity"
import { IImagenArticulo } from "../ImagenArticulo/IImagenArticulo"
import { IUnidadMedida } from "../UnidadMedida/IUnidadMedida"

export interface IArticuloManufacturado extends IBaseEntity {
    denominacion: string
    precioVenta: number
    descripcion: string
    tiempoEstimadoMinutos: number
    preparacion: string
    articuloManufacturadoDetalles: IArticuloManufacturadoDetalle[]
    imagenes: IImagenArticulo[]
    unidadMedida: IUnidadMedida
    categoria: ICategoria
}