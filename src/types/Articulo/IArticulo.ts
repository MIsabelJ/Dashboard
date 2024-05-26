import { IBaseEntity } from "../IBaseEntity"
import { IImagenArticulo } from "../ImagenArticulo/IImagenArticulo"
import { IUnidadMedida } from "../UnidadMedida/IUnidadMedida"

export interface IArticulo extends IBaseEntity {
    denominacion: string
    precioVenta: number
    imagenes: IImagenArticulo[]
    unidadMedida: IUnidadMedida
}