import { IArticuloManufacturado } from "../types/ArticuloManufacturado/IArticuloManufacturado";
import { IArticuloManufacturadoPost } from "../types/ArticuloManufacturado/IArticuloManufacturadoPost";
import { BackendClient } from "./BackendClient";


export class ManufacturadoService extends BackendClient<IArticuloManufacturado, IArticuloManufacturadoPost> {
}