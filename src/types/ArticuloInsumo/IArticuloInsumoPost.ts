import { IImagen } from "../Imagen/IImagen"

export interface IArticuloInsumoPost {
    denominacion: string
    precioVenta: number
    imagenes: IImagen[]
    precioCompra: number
    stockActual: number
    stockMaximo: number
    esParaElaborar: boolean
    idUnidadMedida: number
    idCategoria: number
}

