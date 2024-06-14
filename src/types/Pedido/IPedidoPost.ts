import { IDetallePedidoPost } from "../DetallePedido/IDetallePedidoPost";
import { IFacturaPost } from "../Factura/IFacturaPost";

export interface IPedidoPost {
    horaEstimadaFinalizacion: string,
    total: number,
    totalCosto: number,
    estado: string,
    tipoEnvio: string,
    formaPago: string,
    fechaPedido: string,

    idDomicilio: number,
    idSucursal: number,
    factura: IFacturaPost,
    idCliente: number,
    detallePedidos: IDetallePedidoPost[],
    idEmpleado: number
}