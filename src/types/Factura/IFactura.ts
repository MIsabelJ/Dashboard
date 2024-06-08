export interface IFactura {
    id?: number,
    fechaFacturacion: string,
    mpPaymentId: number,
    mpMerchantOrderId: number,
    mpPreferenceId: string,
    mpPaymentType: string,
    formaPago: string,
    totalVenta: number
}