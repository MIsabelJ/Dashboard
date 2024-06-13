import { IEmpresa } from "../types/Empresa/IEmpresa";
import { IEmpresaPost } from "../types/Empresa/IEmpresaPost";
import { ISucursal } from "../types/Sucursal/ISucursal";
import { BackendClient } from "./BackendClient";

export class EmpresaService extends BackendClient<
  IEmpresa,
  IEmpresaPost,
  IEmpresaPost
> {
  async getSucursalesByEmpresaId(idEmpresa: number): Promise<ISucursal[]> {
    const response = await fetch(`${this.baseUrl}/${idEmpresa}/sucursales`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "no-cors",
        Authorization: `Bearer ${this.token}`,
      },
    });
    const data = await response.json();
    return data as ISucursal[];
  }
}
