import { IArticuloManufacturadoPost } from "../types/ArticuloManufacturado/IArticuloManufacturadoPost";
import { IArticuloManufacturadoDetalle } from "../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetalle";
import { IArticuloManufacturadoDetallePost } from "../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost";
import { BackendClient } from "./BackendClient";

export class ManufacturadoDetalleService extends BackendClient<IArticuloManufacturadoDetalle, IArticuloManufacturadoDetallePost, IArticuloManufacturadoDetallePost>{}