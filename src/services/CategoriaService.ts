import { IArticuloInsumo } from "../types/ArticuloInsumo/IArticuloInsumo";
import { ICategoria } from "../types/Categoria/ICategoria";
import { ICategoriaPost } from "../types/Categoria/ICategoriaPost";
import { BackendClient } from "./BackendClient";

export class CategoriaService extends BackendClient<
  ICategoria,
  ICategoriaPost,
  ICategoriaPost
> {
  async addSubCategoria(
    idCategoria: number,
    subCategoria: ICategoriaPost
  ): Promise<ICategoria> {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${this.baseUrl}/addSubCategoria/${idCategoria}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subCategoria),
      }
    );
    return await response.json();
  }

  async getInsumoBySucursalId(sucursalId: number): Promise<IArticuloInsumo[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${this.baseUrl}/${sucursalId}/articulo-insumo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  }
}
