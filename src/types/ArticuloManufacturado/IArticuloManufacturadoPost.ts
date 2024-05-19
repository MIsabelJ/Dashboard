export interface IArticuloManufacturadoPost{
    denominacion: string
    precioVenta: number
    descripcion: string
    tiempoEstimadoMinutos: number
    preparacion: string
    idArticuloManufacturadoDetalles: number[]
    idImagenes: number[]
    idUnidadMedida: number
    idCategoria: number
}