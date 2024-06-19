import { IArticuloManufacturadoDetallePost } from "../ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost";
import { IImagen } from "../Imagen/IImagen";

export interface IArticuloManufacturadoPost {
  precioCompra?: number;
  denominacion: string;
  precioVenta: number;
  descripcion: string;
  tiempoEstimadoMinutos: number;
  preparacion: string;
  articuloManufacturadoDetalles: IArticuloManufacturadoDetallePost[];
  imagenes: IImagen[];
  idUnidadMedida: number;
  idCategoria: number;
  idSucursal: number;
}
