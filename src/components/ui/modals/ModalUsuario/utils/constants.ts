import { IEmpleadoPost } from "../../../../../types/Empleado/IEmpleadoPost";
import { IUsuarioPost } from "../../../../../types/Usuario/IUsuarioPost";

export const API_URL = import.meta.env.VITE_API_URL;

export const initialValues: IEmpleadoPost = {
    nombre: "",
    apellido: "",
    tipoEmpleado: "",
    idSucursal: 0,
    pedidos: [],
    usuarioEmpleado: {
        email: "",
        password: "",
        username: "",
    },
};
