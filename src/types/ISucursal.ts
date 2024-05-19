import { IBaseEntity } from "./IBaseEntity";
import { IDomicilio } from "./IDomicilio";
import { IEmpresa } from "./IEmpresa";

export interface ISucursal extends IBaseEntity {
    nombre: string
    horarioApertura: string
    horarioCierre: string
    esCasaMatriz: boolean
    domicilio: IDomicilio
    empresa: IEmpresa
}

// FORMATO DE JSON TRAIDO DESDE EL GET AL BACK EN JAVA
// {
//     id: 0,
//     eliminado: true,
//     nombre: string,
//     horarioApertura: HH:mm:ss,
//     horarioCierre: HH:mm:ss,
//     esCasaMatriz: true,
//     domicilio: {
//       id: 0,
//       eliminado: true,
//       calle: string,
//       numero: 0,
//       cp: 0,
//       piso: 0,
//       nroDpto: 0,
//       localidad: {
//         id: 0,
//         eliminado: true,
//         nombre: string,
//         provincia: {
//           id: 0,
//           eliminado: true,
//           nombre: string,
//           pais: {
//             id: 0,
//             eliminado: true,
//             nombre: string
//           }
//         }
//       }
//     },
//     empresa: {
//       id: 0,
//       eliminado: true,
//       nombre: string,
//       razonSocial: string,
//       cuil: 0
//     }
//   }