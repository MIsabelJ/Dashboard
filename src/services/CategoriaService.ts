import { ICategoria } from "../types/Categoria/ICategoria";
import { ICategoriaPost } from "../types/Categoria/ICategoriaPost";
import { BackendClient } from "./BackendClient";


export class CategoriaService extends BackendClient<ICategoria, ICategoriaPost, ICategoriaPost> {
    async addSubCategoria(idCategoria: number, subCategoria: ICategoriaPost): Promise<ICategoria> {
        const response = await fetch(`${this.baseUrl}/addSubCategoria/${idCategoria}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subCategoria),
        });
        return await response.json();
      }
}