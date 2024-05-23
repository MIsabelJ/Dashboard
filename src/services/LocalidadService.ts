import { ILocalidad } from "../types/Localidad/ILocalidad";
import { ILocalidadPost } from "../types/Localidad/ILocalidadPost";
import { BackendClient } from "./BackendClient";

export class LocalidadService extends BackendClient<ILocalidad, ILocalidadPost, ILocalidadPost>{}