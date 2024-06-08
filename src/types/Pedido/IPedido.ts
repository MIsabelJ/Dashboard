import { IDetallePedido } from "../DetallePedido/IDetallePedido";
import { IDomicilio } from "../Domicilio/IDomicilio";
import { IFactura } from "../Factura/IFactura";
import { ISucursal } from "../Sucursal/ISucursal";
import { ICliente } from "../Cliente/ICliente";
import { IBaseEntity } from "../IBaseEntity";


export interface IPedido extends IBaseEntity {
    horaEstimadaFinalizacion: string,
    total: number,
    totalCosto: number,
    estado: string,
    tipoEnvio: string,
    formaPago: string,
    fechaPedido: string,

    domicilio: IDomicilio,
    sucursal: ISucursal,
    factura: IFactura,
    cliente: ICliente,
    detallePedidos: IDetallePedido[],
    // empleado: IEmpleado //TODO: falta esta propiedad en el back?
}