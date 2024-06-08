import { IUsuario } from "../types/Usuario/IUsuario"
import { IUsuarioPost } from "../types/Usuario/IUsuarioPost"
import { BackendClient } from "./BackendClient"

export class UsuarioService extends BackendClient<IUsuario, IUsuarioPost, IUsuarioPost> {
}