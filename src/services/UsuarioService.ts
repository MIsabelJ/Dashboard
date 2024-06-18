import { IUsuario } from "../types/Usuario/IUsuario"
import { IUsuarioPost } from "../types/Usuario/IUsuarioPost"
import { BackendClient } from "./BackendClient"

export class UsuarioService extends BackendClient<IUsuario, IUsuarioPost, IUsuarioPost> {
    async getByEmail(email: string) : Promise<IUsuario | null>{
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.baseUrl}/find/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok){
            return null;
        }
        const data = await response.json();
        return data as IUsuario;
    }
}