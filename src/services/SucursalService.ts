import { ISucursal } from "../types/Sucursal/ISucursal";
import { ISucursalEdit } from "../types/Sucursal/ISucursalEdit";
import { ISucursalPost } from "../types/Sucursal/ISucursalPost";
import { BackendClient } from "./BackendClient";

export class SucursalService extends BackendClient<ISucursal, ISucursalPost, ISucursalEdit> { }