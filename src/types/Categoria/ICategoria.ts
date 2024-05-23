import { IBaseEntity } from "../IBaseEntity";
import { ISucursal } from "../Sucursal/ISucursal";

export interface ICategoria extends IBaseEntity {
  id: number
  denominacion: string
  sucursales: ISucursal[]
  subcategorias: ICategoria[]
}
