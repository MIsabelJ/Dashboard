import { IBaseEntity } from "../IBaseEntity"
import { IProvincia } from "../Provincia/IProvincia"

export interface ILocalidad extends IBaseEntity {
    nombre: string
    provincia: IProvincia
}