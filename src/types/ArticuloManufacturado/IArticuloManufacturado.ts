import { IArticuloManufacturadoDetalle } from "../ArticuloManufacturadoDetalle/IArticuloManufacturadoDetalle"
import { ICategoria } from "../Categoria/ICategoria"
import { IBaseEntity } from "../IBaseEntity"
import { IImagen } from "../Imagen/IImagen"
import { IUnidadMedida } from "../UnidadMedida/IUnidadMedida"

export interface IArticuloManufacturado extends IBaseEntity {
    precioCompra?: number
    denominacion: string
    precioVenta: number
    descripcion: string
    tiempoEstimadoMinutos: number
    preparacion: string
    articuloManufacturadoDetalles: IArticuloManufacturadoDetalle[]
    imagenes: IImagen[]
    unidadMedida: IUnidadMedida
    categoria: ICategoria
}