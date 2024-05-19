import { IBaseEntity } from "../IBaseEntity";
import { IDomicilio } from "../Domicilio/IDomicilio";
import { IEmpresa } from "../Empresa/IEmpresa";

export interface ISucursal extends IBaseEntity {
    nombre: string
    horarioApertura: string
    horarioCierre: string
    esCasaMatriz: boolean
    domicilio: IDomicilio
    empresa: IEmpresa
}