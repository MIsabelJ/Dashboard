import { IBaseEntity } from "./IBaseEntity"
import { IPais } from "./IPais"

export interface IProvincia extends IBaseEntity {
    nombre: string
    pais: IPais
}
