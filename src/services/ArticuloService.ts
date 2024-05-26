import { IArticulo } from "../types/Articulo/IArticulo";
import { IArticuloPost } from "../types/Articulo/IArticuloPost";
import { BackendClient } from "./BackendClient";

export class ArticuloService extends BackendClient<IArticulo, IArticuloPost, IArticuloPost> {
    
}