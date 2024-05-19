import { IImagenArticulo } from "../types/ImagenArticulo/IImagenArticulo";
import { IImagenArticuloPost } from "../types/ImagenArticulo/IImagenArticuloPost";
import { BackendClient } from "./BackendClient";

export class ImagenArticuloService extends BackendClient<IImagenArticulo, IImagenArticuloPost> {
}