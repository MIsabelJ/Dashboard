import { IImagen } from "../Imagen/IImagen";
import { IPromocionDetallePost } from "../PromocionDetalle/IPromocionDetallePost";

export interface IPromocionPost {
  denominacion: string;
  fechaDesde: string;
  fechaHasta: string;
  horaDesde: string;
  horaHasta: string;
  descripcionDescuento: string;
  precioPromocional: number;
  tipoPromocion: string;
  promocionDetalles: IPromocionDetallePost[];
  imagenes: IImagen[];
  idSucursales: number[];
}
