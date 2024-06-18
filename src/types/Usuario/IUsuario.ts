import { IBaseEntity } from "../IBaseEntity";
import { ISucursal } from "../Sucursal/ISucursal";

export interface IUsuario extends IBaseEntity { //El usuario que interactua en el dashboard
    email: string,
    userName: string,
    password: string,
}