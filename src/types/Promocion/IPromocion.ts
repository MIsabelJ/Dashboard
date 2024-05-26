import { IBaseEntity } from "../IBaseEntity";
import { ISucursal } from "../Sucursal/ISucursal";
import { IPromocionDetalle } from "../PromocionDetalle/IPromocionDetalle";
import { IImagenPromocion } from "../ImagenPromocion/IImagenPromocion";

export interface IPromocion extends IBaseEntity {
    denominacion: string
    fechaDesde: string
    fechaHasta: string
    horaDesde: string
    horaHasta: string
    descripcionDescuento: string
    precioPromocional: number
    tipoPromocion: string
    promocionDetalles: IPromocionDetalle[]
    imagenes: IImagenPromocion[]
    sucursales: ISucursal[]
}
