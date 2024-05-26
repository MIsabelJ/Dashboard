import { IDomicilioPost } from "../Domicilio/IDomicilioPost"

export interface ISucursalPost {
    nombre: string
    horarioApertura: string
    horarioCierre: string
    esCasaMatriz: boolean
    domicilio: IDomicilioPost
    idEmpresa: number
}