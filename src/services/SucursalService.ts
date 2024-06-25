import { IArticuloInsumo } from "../types/ArticuloInsumo/IArticuloInsumo";
import { IArticuloManufacturado } from "../types/ArticuloManufacturado/IArticuloManufacturado";
import { ICategoria } from "../types/Categoria/ICategoria";
import { IPedido } from "../types/Pedido/IPedido";
import { IPromocion } from "../types/Promocion/IPromocion";
import { ISucursal } from "../types/Sucursal/ISucursal";
import { ISucursalEdit } from "../types/Sucursal/ISucursalEdit";
import { ISucursalPost } from "../types/Sucursal/ISucursalPost";
import { BackendClient } from "./BackendClient";

export class SucursalService extends BackendClient<
  ISucursal,
  ISucursalPost,
  ISucursalEdit
> {
  async getCategoriasBySucursalId(sucursalId: number): Promise<ICategoria[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}/${sucursalId}/categorias`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }

  async getManufacturadosBySucursalId(
    sucursalId: number
  ): Promise<IArticuloManufacturado[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${this.baseUrl}/${sucursalId}/manufacturados`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  }

  async getInsumosBySucursalId(sucursalId: number): Promise<IArticuloInsumo[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}/${sucursalId}/insumos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }

  async getPromocionesBySucursalId(sucursalId: number): Promise<IPromocion[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}/${sucursalId}/promociones`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }

  async getPedidosBySucursalId(sucursalId: number): Promise<IPedido[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}/${sucursalId}/pedidos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }
}
