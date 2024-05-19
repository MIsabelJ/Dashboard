import { IPais } from "../types/Pais/IPais";
import { IPaisPost } from "../types/Pais/IPaisPost";
import { BackendClient } from "./BackendClient";

export class PaisService extends BackendClient<IPais, IPaisPost> {}