import { IBaseEntity } from "../IBaseEntity"
import { ILocalidad } from "../Localidad/ILocalidad"

export interface IDomicilio extends IBaseEntity{
    calle: string
    numero: number
    cp: number
    piso: number
    nroDpto: number
    localidad: ILocalidad
}