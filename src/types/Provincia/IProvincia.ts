import { IBaseEntity } from "../IBaseEntity"
import { IPais } from "../Pais/IPais"

export interface IProvincia extends IBaseEntity {
    nombre: string
    pais: IPais
}
