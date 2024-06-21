import { IBaseEntity } from "../IBaseEntity";
import { IPedido } from "../Pedido/IPedido";
import { IUsuario } from "../Usuario/IUsuario";
import { IUsuarioPost } from "../Usuario/IUsuarioPost";

export interface IEmpleadoPost {
    nombre: string
    apellido: string
    tipoEmpleado: string;
    idSucursal: number;
    pedidos: IPedido[];
    usuarioEmpleado: IUsuarioPost
  }