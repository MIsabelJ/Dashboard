import { ICategoria } from "../Categoria/ICategoria"
import { IBaseEntity } from "../IBaseEntity"
import { IImagenArticulo } from "../ImagenArticulo/IImagenArticulo"
import { IUnidadMedida } from "../UnidadMedida/IUnidadMedida"

export interface IArticuloInsumo extends IBaseEntity {
    denominacion: string
    precioVenta: number
    imagenes:IImagenArticulo[]
    precioCompra: number
    stockActual: number
    stockMaximo: number
    esParaElaborar: boolean
    unidadMedida: IUnidadMedida
    categoria: ICategoria
}