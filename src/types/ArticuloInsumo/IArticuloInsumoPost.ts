import { IImagenArticulo } from "../ImagenArticulo/IImagenArticulo"
import { IUnidadMedida } from "../UnidadMedida/IUnidadMedida"

export interface IArticuloInsumoPost{
    denominacion: string
    precioVenta: number
    idImagenes:number[]
    precioCompra: number
    stockActual: number
    stockMaximo: number
    esParaElaborar: boolean
    idUnidadMedida: number
    idCategoria: number
}