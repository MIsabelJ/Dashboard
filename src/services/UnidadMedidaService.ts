import { IUnidadMedida } from "../types/UnidadMedida/IUnidadMedida";
import { IUnidadMedidaPost } from "../types/UnidadMedida/IUnidadMedidaPost";
import { BackendClient } from "./BackendClient";

export class UnidadMedidaService extends BackendClient<IUnidadMedida, IUnidadMedidaPost> {}