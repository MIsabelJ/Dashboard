import { IBaseEntity } from "../IBaseEntity";

export interface IEmpresa extends IBaseEntity {
    nombre: string;
    razonSocial: string;
    cuil: number;
}