import { IEmpresa } from "../types/Empresa/IEmpresa";
import { IEmpresaPost } from "../types/Empresa/IEmpresaPost";
import { BackendClient } from "./BackendClient";


export class EmpresaService extends BackendClient<IEmpresa, IEmpresaPost> {}