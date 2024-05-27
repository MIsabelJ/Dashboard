import { ICategoria } from "../Categoria/ICategoria"
import { IBaseEntity } from "../IBaseEntity"
import { IImagen } from "../Imagen/IImagen"
import { IUnidadMedida } from "../UnidadMedida/IUnidadMedida"

export interface IArticuloInsumo extends IBaseEntity {
    denominacion: string
    precioVenta: number
    imagenes: IImagen[]
    precioCompra: number
    stockActual: number
    stockMaximo: number
    esParaElaborar: boolean
    unidadMedida: IUnidadMedida
    categoria: ICategoria
}