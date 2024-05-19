import { IBaseEntity } from "./IBaseEntity"
import { IProvincia } from "./IProvincia"

export interface ILocalidad extends IBaseEntity {
    nombre: string
    provincia: IProvincia
}