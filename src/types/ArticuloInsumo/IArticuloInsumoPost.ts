import { IImagenArticuloPost } from "../Imagen/IImagenPost"

export interface IArticuloInsumoPost {
    denominacion: string
    precioVenta: number
    idImagenes: string[]
    precioCompra: number
    stockActual: number
    stockMaximo: number
    esParaElaborar: boolean
    idUnidadMedida: number
    idCategoria: number
}

