import { IBaseEntity } from "./IBaseEntity"
import { ILocalidad } from "./Ilocalidad"

export interface IDomicilio extends IBaseEntity{
    calle: string
    numero: number
    cp: number
    piso: number
    nroDpto: number
    localidad: ILocalidad
}