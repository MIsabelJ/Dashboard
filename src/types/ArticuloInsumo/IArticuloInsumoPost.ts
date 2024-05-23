export interface IArticuloInsumoPost {
    denominacion: string
    precioVenta: number
    imagenes: string[]
    precioCompra: number
    stockActual: number
    stockMaximo: number
    esParaElaborar: boolean
    idUnidadMedida: number
    idCategoria: number
}