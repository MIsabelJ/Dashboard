
export interface IArticuloInsumoPost {
    denominacion: string
    precioVenta: number
    imagenes: File[]
    precioCompra: number
    stockActual: number
    stockMaximo: number
    esParaElaborar: boolean
    idUnidadMedida: number
    idCategoria: number
}

