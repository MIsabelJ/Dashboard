import { IBaseEntity } from "../IBaseEntity";
import { ISucursal } from "../Sucursal/ISucursal";

export interface IUsuario extends IBaseEntity { //El usuario que interactua en el dashboard
    name: string,
    rol: string,
    // sucursal: ISucursal, //TODO: Cuanto esté el endpoint listo, quitar la propiedad de abajo y descomentar esta
    sucursal: string,
}