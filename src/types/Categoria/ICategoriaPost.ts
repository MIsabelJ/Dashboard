import { ISucursal } from "../Sucursal/ISucursal";

export interface ICategoriaPost {
  denominacion: string;
  idSucursales: number[];
  idSubcategorias: number[];
}
