import { IBaseEntity } from "./IBaseEntity";
import { ISucursal } from "./ISucursal";

export interface ICategoria extends IBaseEntity {
  denominacion: string
  sucursales: ISucursal[]
}
