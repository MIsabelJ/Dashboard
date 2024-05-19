import { IArticuloManufacturadoPost } from "../types/ArticuloManufacturado/IArticuloManufacturadoPost";
import { IArticuloManufacturadoDetalle } from "../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetalle";
import { BackendClient } from "./BackendClient";

export class ManufacturadoDetalleService extends BackendClient<IArticuloManufacturadoDetalle, IArticuloManufacturadoPost>{}