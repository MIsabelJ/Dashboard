import { IBaseEntity } from "./IBaseEntity"
import { IImagenArticulo } from "./IImagenArticulo"
import { IUnidadMedida } from "./IUnidadMedida"

export interface IArticuloInsumo extends IBaseEntity {
    denominacion: string
    precioVenta: number
    imagenes:IImagenArticulo[]
    precioCompra: number
    stockActual: number
    stockMaximo: number
    esParaElaborar: boolean
    unidadMedida: IUnidadMedida
}