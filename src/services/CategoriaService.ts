import { ICategoria } from "../types/Categoria/ICategoria";
import { ICategoriaPost } from "../types/Categoria/ICategoriaPost";
import { BackendClient } from "./BackendClient";


export class CategoriaService extends BackendClient<ICategoria, ICategoriaPost> {
}