import { IBaseEntity } from "../IBaseEntity"
import { IImagen } from "../Imagen/IImagen"
import { IUnidadMedida } from "../UnidadMedida/IUnidadMedida"

export interface IArticulo extends IBaseEntity {
    denominacion: string,
    precioCompra: number,
    precioVenta: number,
    imagenes: IImagen[],
    unidadMedida: IUnidadMedida,
}