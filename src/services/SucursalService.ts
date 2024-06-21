import { IArticuloManufacturado } from "../types/ArticuloManufacturado/IArticuloManufacturado";
import { ICategoria } from "../types/Categoria/ICategoria";
import { ISucursal } from "../types/Sucursal/ISucursal";
import { ISucursalEdit } from "../types/Sucursal/ISucursalEdit";
import { ISucursalPost } from "../types/Sucursal/ISucursalPost";
import { BackendClient } from "./BackendClient";

export class SucursalService extends BackendClient<
  ISucursal,
  ISucursalPost,
  ISucursalEdit
> {
  async getCategoriaBySucursalId(sucursalId: number): Promise<ICategoria[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}/${sucursalId}/categorias`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }

  async getManufacturadoBySucursalId(
    sucursalId: number
  ): Promise<IArticuloManufacturado[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${this.baseUrl}/${sucursalId}/articulo-manufacturado`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  }
}
