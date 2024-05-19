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