import { IProvincia } from "../types/Provincia/IProvincia";
import { IProvinciaPost } from "../types/Provincia/IProvinciaPost";
import { BackendClient } from "./BackendClient";

export class ProvinciaService extends BackendClient<IProvincia, IProvinciaPost, IProvinciaPost>{}