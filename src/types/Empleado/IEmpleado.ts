import { IBaseEntity } from "../IBaseEntity";
import { IPedido } from "../Pedido/IPedido";
import { ISucursal } from "../Sucursal/ISucursal";
import { IUsuario } from "../Usuario/IUsuario";

export interface IEmpleado extends IBaseEntity {
  nombre: string
  apellido: string
  tipoEmpleado: string;
  sucursal: ISucursal;
  pedidos: IPedido[];
  usuarioEmpleado: IUsuario
}
