import { IBaseEntity } from "../IBaseEntity";
import { IDomicilio } from "../Domicilio/IDomicilio";
import { IEmpresa } from "../Empresa/IEmpresa";
import { ICategoria } from "../Categoria/ICategoria";

export interface ISucursal extends IBaseEntity {
    nombre: string
    horarioApertura: string
    horarioCierre: string
    esCasaMatriz: boolean
    domicilio: IDomicilio
    empresa: IEmpresa
    categorias: ICategoria[]
}