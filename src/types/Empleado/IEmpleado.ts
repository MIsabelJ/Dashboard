import { IBaseEntity } from "../IBaseEntity";
import { IPedido } from "../Pedido/IPedido";
import { ISucursal } from "../Sucursal/ISucursal";

export interface IEmpleado extends IBaseEntity {
  rol: string;
  sucursal: ISucursal;
  pedidos: IPedido[];
}
