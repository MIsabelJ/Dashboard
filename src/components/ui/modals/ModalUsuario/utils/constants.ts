import { IUsuarioPost } from "../../../../../types/Usuario/IUsuarioPost";

export const API_URL = import.meta.env.VITE_API_URL;

export const initialValues: IUsuarioPost = {
    name: "",
    rol: "cajero",
    idSucursal: 1
};
