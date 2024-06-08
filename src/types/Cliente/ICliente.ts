
import { IDomicilio } from "../Domicilio/IDomicilio";
import { IUsuarioCliente } from "../UsuarioCliente/IUsuarioCliente";
import { IImagen } from "../Imagen/IImagen";

export interface ICliente { //Esta es la versión shortDto
    id?: number,
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    usuario: IUsuarioCliente,
    imagenCliente: IImagen,
    domicilios: IDomicilio[]
}