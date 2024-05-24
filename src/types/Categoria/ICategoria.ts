import { IBaseEntity } from "../IBaseEntity";
import { ISucursal } from "../Sucursal/ISucursal";

export interface ICategoria extends IBaseEntity {
  denominacion: string
  sucursales: ISucursal[]
  subCategorias: ICategoria[]
}
