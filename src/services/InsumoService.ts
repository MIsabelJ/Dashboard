import { IArticuloInsumo } from "../types/ArticuloInsumo/IArticuloInsumo";
import { IArticuloInsumoPost } from "../types/ArticuloInsumo/IArticuloInsumoPost";
import { BackendClient } from "./BackendClient";


export class InsumoService extends BackendClient<IArticuloInsumo, IArticuloInsumoPost> {
}